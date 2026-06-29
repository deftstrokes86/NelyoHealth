import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, stat } from "node:fs/promises";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(__dirname);
const host = process.env.SMOKE_HOST || "127.0.0.1";
const port = Number(process.env.SMOKE_PORT || 4173);

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"]
]);
const apiJsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

const publicFiles = new Set(["/index.html", "/app.js", "/styles.css"]);

function safePath(urlPath) {
  const pathOnly = urlPath === "/" ? "/index.html" : urlPath;
  if (!publicFiles.has(pathOnly)) {
    return null;
  }
  const candidate = normalize(join(root, pathOnly));
  if (!candidate.startsWith(root)) {
    return null;
  }
  return candidate;
}

export function createSmokeServer() {
  return createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || "/", `http://${host}:${port}`);

      response.setHeader("X-Content-Type-Options", "nosniff");
      response.setHeader("Referrer-Policy", "no-referrer");
      response.setHeader("Cache-Control", "no-store");

      if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "method_not_allowed" }));
        return;
      }

      if (requestUrl.pathname === "/favicon.ico") {
        response.writeHead(204);
        response.end();
        return;
      }

      if (requestUrl.pathname === "/api/smoke") {
        await new Promise((resolveDelay) => setTimeout(resolveDelay, 80));
        const fail = requestUrl.searchParams.get("state") === "error";
        response.writeHead(fail ? 503 : 200, { "Content-Type": "application/json; charset=utf-8" });
        response.end(
          JSON.stringify({
            synthetic: true,
            environment: "local-only",
            status: fail ? "synthetic-error" : "synthetic-ok",
            message: fail
              ? "Synthetic handled error state."
              : "Synthetic same-origin request completed."
          })
        );
        return;
      }

      if (requestUrl.pathname === "/api/payment-transition") {
        response.writeHead(200, apiJsonHeaders);
        response.end(
          JSON.stringify({
            data: {
              paymentId: "payment-route-1",
              orderId: "order-route-1",
              status: "initiated",
              amount: "5000",
              currency: "NGN",
              authorizedAt: null,
              settledAt: null
            },
            meta: {
              requestId: "req-payment-route",
              correlationId: "corr-payment-route",
              operationTag: "payment.transition",
              decisionReasonTag: "to:initiated"
            },
            errors: []
          })
        );
        return;
      }

      if (requestUrl.pathname === "/api/refund-transition") {
        response.writeHead(200, apiJsonHeaders);
        response.end(
          JSON.stringify({
            data: {
              refundId: "refund-route-1",
              paymentId: "payment-route-1",
              orderId: "order-route-1",
              status: "eligibility-review",
              amount: "5000",
              currency: "NGN",
              completedAt: null
            },
            meta: {
              requestId: "req-refund-route",
              correlationId: "corr-refund-route",
              operationTag: "refund.transition",
              decisionReasonTag: "to:eligibility-review"
            },
            errors: []
          })
        );
        return;
      }

      if (requestUrl.pathname === "/api/disclosure-eligibility") {
        const paymentStatus = requestUrl.searchParams.get("paymentStatus") ?? "quoted";
        const refundStatus = requestUrl.searchParams.get("refundStatus");
        const sameTenant = requestUrl.searchParams.get("sameTenant") !== "false";
        const hasAuthorization = requestUrl.searchParams.get("hasAuthorization") !== "false";
        const orderId = requestUrl.searchParams.get("orderId") ?? "order-synthetic";
        const providerDisplayName =
          requestUrl.searchParams.get("providerDisplayName") ?? "Synthetic Provider";

        let payload = {
          orderId,
          status: "eligible",
          reasonCode: "eligible",
          providerDisplayName,
          authorizedAt: new Date(0).toISOString()
        };

        if (!sameTenant) {
          payload = {
            ...payload,
            status: "denied",
            reasonCode: "tenant-mismatch",
            authorizedAt: null
          };
        } else if (!hasAuthorization) {
          payload = {
            ...payload,
            status: "denied",
            reasonCode: "authorization-missing",
            authorizedAt: null
          };
        } else if (paymentStatus !== "settled") {
          payload = {
            ...payload,
            status: "not-eligible",
            reasonCode: "payment-not-settled",
            authorizedAt: null
          };
        } else if (refundStatus === "completed") {
          payload = {
            ...payload,
            status: "not-eligible",
            reasonCode: "policy-gated",
            authorizedAt: null
          };
        }

        response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        response.end(
          JSON.stringify({
            data: payload,
            meta: {
              requestId: "req-disclosure-route",
              correlationId: "corr-disclosure-route",
              operationTag: "provider-disclosure.eligibility.evaluate",
              decisionReasonTag: payload.reasonCode
            },
            errors: []
          })
        );
        return;
      }

      const filePath = safePath(requestUrl.pathname);
      if (!filePath) {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found");
        return;
      }

      const fileInfo = await stat(filePath);
      if (!fileInfo.isFile()) {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found");
        return;
      }

      const body = await readFile(filePath);
      response.writeHead(200, {
        "Content-Type": contentTypes.get(extname(filePath)) || "application/octet-stream"
      });
      response.end(request.method === "HEAD" ? undefined : body);
    } catch {
      response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "synthetic_smoke_server_error" }));
    }
  });
}

async function runCheck() {
  for (const fileName of ["index.html", "app.js", "styles.css"]) {
    const fileInfo = await stat(join(root, fileName));
    if (!fileInfo.isFile()) {
      throw new Error(`Missing smoke file: ${fileName}`);
    }
  }
  console.log("browser-smoke build check passed");
}

if (process.argv.includes("--check")) {
  await runCheck();
} else {
  const server = createSmokeServer();
  server.listen(port, host, () => {
    console.log(`Synthetic browser smoke server listening at http://${host}:${port}`);
  });

  const shutdown = () => {
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
