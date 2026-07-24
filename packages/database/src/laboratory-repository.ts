import type { ClientBase } from "pg";

/**
 * Laboratory repository (roadmap M5.6 — Laboratories).
 *
 * Owns SQL for the lab-order + result-observation aggregates in nelyo_laboratory.
 * Client-parameterized so callers control the transaction boundary: mutations run
 * inside the transactional-command path (state + outbox + audit in one
 * transaction).
 *
 * Test details and result observations are loaded here for the access-controlled
 * record but the api layer keeps them out of events and audit.
 */

export type LabOrderPriority = "routine" | "urgent" | "stat";
export type LabOrderStatus = "ordered" | "collected" | "resulted" | "cancelled";
export type LabInterpretation = "normal" | "low" | "high" | "abnormal" | "critical";

export interface LabResultObservation {
  observationId: string;
  analyteName: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  interpretation?: LabInterpretation;
  resultedByRef: string;
  resultedAt: string;
}

export interface PersistedLabOrder {
  orderId: string;
  patientRef: string;
  orderingClinicianRef: string;
  organizationRef: string;
  consultationRef?: string;
  testCode?: string;
  testName: string;
  priority: LabOrderPriority;
  clinicalReason?: string;
  status: LabOrderStatus;
  cancellationReasonCode?: string;
  orderedAt: string;
  observations: LabResultObservation[];
  createdAt: string;
  updatedAt: string;
}

interface OrderRow {
  order_id: string;
  patient_ref: string;
  ordering_clinician_ref: string;
  organization_ref: string;
  consultation_ref: string | null;
  test_code: string | null;
  test_name: string;
  priority: LabOrderPriority;
  clinical_reason: string | null;
  status: LabOrderStatus;
  cancellation_reason_code: string | null;
  ordered_at: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
}

interface ObservationRow {
  observation_id: string;
  analyte_name: string;
  value: string;
  unit: string | null;
  reference_range: string | null;
  interpretation: LabInterpretation | null;
  resulted_by_ref: string;
  resulted_at: string | Date;
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

const ORDER_COLUMNS =
  "order_id, patient_ref, ordering_clinician_ref, organization_ref, consultation_ref, test_code, " +
  "test_name, priority, clinical_reason, status, cancellation_reason_code, ordered_at, created_at, " +
  "updated_at";

function mapOrder(row: OrderRow, observations: LabResultObservation[]): PersistedLabOrder {
  return {
    orderId: row.order_id,
    patientRef: row.patient_ref,
    orderingClinicianRef: row.ordering_clinician_ref,
    organizationRef: row.organization_ref,
    consultationRef: row.consultation_ref ?? undefined,
    testCode: row.test_code ?? undefined,
    testName: row.test_name,
    priority: row.priority,
    clinicalReason: row.clinical_reason ?? undefined,
    status: row.status,
    cancellationReasonCode: row.cancellation_reason_code ?? undefined,
    orderedAt: toIso(row.ordered_at),
    observations,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at)
  };
}

// ---------- Mutations (run inside the transactional command) ----------

export async function insertLabOrder(
  client: ClientBase,
  input: {
    orderId: string;
    patientRef: string;
    orderingClinicianRef: string;
    organizationRef: string;
    consultationRef?: string;
    testCode?: string;
    testName: string;
    priority: LabOrderPriority;
    clinicalReason?: string;
    orderedAt: string;
    createdAt: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_laboratory.lab_order
       (order_id, patient_ref, ordering_clinician_ref, organization_ref, consultation_ref,
        test_code, test_name, priority, clinical_reason, status, ordered_at, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'ordered', $10, $11, $12)`,
    [
      input.orderId,
      input.patientRef,
      input.orderingClinicianRef,
      input.organizationRef,
      input.consultationRef ?? null,
      input.testCode ?? null,
      input.testName,
      input.priority,
      input.clinicalReason ?? null,
      input.orderedAt,
      input.createdAt,
      input.updatedAt
    ]
  );
}

export async function insertLabResultObservation(
  client: ClientBase,
  input: {
    observationId: string;
    orderRef: string;
    analyteName: string;
    value: string;
    unit?: string;
    referenceRange?: string;
    interpretation?: LabInterpretation;
    resultedByRef: string;
    resultedAt: string;
    createdAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_laboratory.lab_result_observation
       (observation_id, order_ref, analyte_name, value, unit, reference_range, interpretation,
        resulted_by_ref, resulted_at, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      input.observationId,
      input.orderRef,
      input.analyteName,
      input.value,
      input.unit ?? null,
      input.referenceRange ?? null,
      input.interpretation ?? null,
      input.resultedByRef,
      input.resultedAt,
      input.createdAt
    ]
  );
}

export async function setLabOrderStatus(
  client: ClientBase,
  input: {
    orderId: string;
    status: LabOrderStatus;
    cancellationReasonCode?: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_laboratory.lab_order
        SET status = $2, cancellation_reason_code = $3, updated_at = $4
      WHERE order_id = $1`,
    [input.orderId, input.status, input.cancellationReasonCode ?? null, input.updatedAt]
  );
}

// ---------- Reads ----------

async function loadObservations(
  client: ClientBase,
  orderId: string
): Promise<LabResultObservation[]> {
  const result = await client.query<ObservationRow>(
    `SELECT observation_id, analyte_name, value, unit, reference_range, interpretation,
            resulted_by_ref, resulted_at
       FROM nelyo_laboratory.lab_result_observation
      WHERE order_ref = $1
      ORDER BY resulted_at ASC`,
    [orderId]
  );
  return result.rows.map((row) => ({
    observationId: row.observation_id,
    analyteName: row.analyte_name,
    value: row.value,
    unit: row.unit ?? undefined,
    referenceRange: row.reference_range ?? undefined,
    interpretation: row.interpretation ?? undefined,
    resultedByRef: row.resulted_by_ref,
    resultedAt: toIso(row.resulted_at)
  }));
}

export async function loadLabOrder(
  client: ClientBase,
  orderId: string
): Promise<PersistedLabOrder | null> {
  const result = await client.query<OrderRow>(
    `SELECT ${ORDER_COLUMNS} FROM nelyo_laboratory.lab_order WHERE order_id = $1`,
    [orderId]
  );
  const row = result.rows[0];
  if (!row) return null;
  return mapOrder(row, await loadObservations(client, orderId));
}

export async function listLabOrdersForPatient(
  client: ClientBase,
  input: { patientRef: string; organizationRef: string }
): Promise<PersistedLabOrder[]> {
  const result = await client.query<OrderRow>(
    `SELECT ${ORDER_COLUMNS} FROM nelyo_laboratory.lab_order
      WHERE patient_ref = $1 AND organization_ref = $2
      ORDER BY ordered_at DESC`,
    [input.patientRef, input.organizationRef]
  );
  const orders: PersistedLabOrder[] = [];
  for (const row of result.rows) {
    orders.push(mapOrder(row, await loadObservations(client, row.order_id)));
  }
  return orders;
}
