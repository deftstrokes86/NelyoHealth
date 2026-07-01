import { Injectable } from "@nestjs/common";
import { InMemoryObservabilityRecorder } from "@nelyohealth/observability";
import { SyntheticQueueAdapter } from "@nelyohealth/platform-adapters";
import { WorkerQueueRuntime, type DeterministicSyntheticJobPayload } from "@nelyohealth/worker";

interface CorrelationProbeInput {
  syntheticTaskId: string;
  failUntilAttempt: number;
  maxAttempts: number;
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
}

@Injectable()
export class ObservabilityService {
  private readonly recorder = new InMemoryObservabilityRecorder();

  async runCorrelationProbe(input: CorrelationProbeInput): Promise<{
    traceId: string;
    statuses: string[];
    metrics: Record<string, number>;
    logs: ReturnType<InMemoryObservabilityRecorder["snapshot"]>["logs"];
    spans: ReturnType<InMemoryObservabilityRecorder["snapshot"]>["spans"];
  }> {
    this.recorder.reset();

    const context = this.recorder.createContext({
      requestId: input.requestId,
      correlationId: input.correlationId,
      operationTag: "api.observability.probe"
    });

    const apiSpanId = this.recorder.startSpan("api.observability.probe", context);
    this.recorder.log("info", "api request received for observability probe", context, {
      syntheticTaskId: input.syntheticTaskId
    });
    this.recorder.metric("api_request_total", 1, context);

    const queue = new SyntheticQueueAdapter<DeterministicSyntheticJobPayload>();
    const runtime = new WorkerQueueRuntime<DeterministicSyntheticJobPayload>(queue);

    await runtime.enqueueJob({
      jobType: "synthetic.observability.probe",
      safeContext: {
        requestId: input.requestId,
        correlationId: input.correlationId,
        idempotencyKey: input.idempotencyKey,
        operationTag: "worker.observability.probe"
      },
      payload: {
        syntheticTaskId: input.syntheticTaskId,
        failUntilAttempt: input.failUntilAttempt
      },
      attempt: 1,
      maxAttempts: input.maxAttempts,
      enqueuedAt: new Date().toISOString()
    });

    const statuses: string[] = [];
    const results = await runtime.runUntilIdle(async (envelope) => {
      const workerSpanId = this.recorder.startSpan("worker.job.process", context, apiSpanId);
      this.recorder.log("info", "worker processing synthetic job", context, {
        jobType: envelope.jobType,
        attempt: envelope.attempt
      });
      this.recorder.metric("worker_job_attempt_total", 1, context, {
        attempt: envelope.attempt
      });

      try {
        if (envelope.attempt <= envelope.payload.failUntilAttempt) {
          throw new Error(`synthetic failure at attempt ${envelope.attempt}`);
        }

        this.recorder.metric("worker_job_success_total", 1, context);
      } catch (error) {
        this.recorder.metric("worker_job_failure_total", 1, context);
        this.recorder.log("warn", "worker synthetic job failed", context, {
          reason: error instanceof Error ? error.message : String(error)
        });
        throw error;
      } finally {
        this.recorder.endSpan("worker.job.process", context, workerSpanId, apiSpanId);
      }
    });

    for (const result of results) {
      statuses.push(result.status);
      if (result.status === "dead-lettered") {
        this.recorder.metric("worker_job_dead_letter_total", 1, context);
      }
    }

    this.recorder.endSpan("api.observability.probe", context, apiSpanId);

    const snapshot = this.recorder.snapshot();
    return {
      traceId: context.traceId,
      statuses,
      metrics: aggregateMetricTotals(snapshot.metrics),
      logs: snapshot.logs,
      spans: snapshot.spans
    };
  }
}

function aggregateMetricTotals(
  metrics: ReturnType<InMemoryObservabilityRecorder["snapshot"]>["metrics"]
): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const metric of metrics) {
    totals[metric.name] = (totals[metric.name] ?? 0) + metric.value;
  }
  return totals;
}
