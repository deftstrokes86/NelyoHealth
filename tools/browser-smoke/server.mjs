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
