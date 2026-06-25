#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(currentFile), "../..");
const composeFile = path.join(rootDir, "infra/local/compose.yaml");
const otelConfigFile = path.join(rootDir, "infra/local/otel-collector.yaml");
const composeProjectName = "nelyohealth-local";

export const imagePins = [
  {
    name: "postgres-postgis",
    image:
      "postgis/postgis:18-3.6-alpine@sha256:24047f97be7cf496a6e41a40a236f489fc4ac9caf26794f0882461f5bb6cd758",
    version: "PostgreSQL 18 / PostGIS 3.6.4",
    license: "PostgreSQL/PostGIS open-source stack; PostGIS code GPL-2.0-or-later"
  },
  {
    name: "valkey",
    image:
      "valkey/valkey:8.1.8-alpine@sha256:77643d152547b446fc15cbafaff22004545663fcd40c6b28038ad283837baa75",
    version: "8.1.8",
    license: "BSD-3-Clause"
  },
  {
    name: "object-storage",
    image:
      "motoserver/moto:5.2.2@sha256:d8ae5edc2bf080e7e4c13f9bd4b29b53ac3b4427e92956318db3dbe23ec43eb7",
    version: "5.2.2",
    license: "Apache-2.0"
  },
  {
    name: "otel-collector",
    image:
      "otel/opentelemetry-collector-contrib:0.155.0@sha256:4935caa35e9a4cb387e35732e8fb22b2b5759af8d12e7043357f03837f6e8df5",
    version: "0.155.0",
    license: "Apache-2.0"
  }
];

const serviceDefinitions = [
  {
    name: "postgres-postgis",
    purpose: "PostgreSQL/PostGIS local dependency",
    env: "NELYO_LOCAL_POSTGRES_PORT",
    defaultPort: 55432,
    health: "tcp"
  },
  {
    name: "valkey",
    purpose: "Redis-compatible local dependency",
    env: "NELYO_LOCAL_VALKEY_PORT",
    defaultPort: 56379,
    health: "tcp"
  },
  {
    name: "object-storage",
    purpose: "S3-compatible synthetic object-storage emulator",
    env: "NELYO_LOCAL_OBJECT_STORAGE_PORT",
    defaultPort: 55000,
    health: "http",
    path: "/moto-api/"
  },
  {
    name: "otel-collector-grpc",
    purpose: "OpenTelemetry OTLP gRPC receiver",
    env: "NELYO_LOCAL_OTEL_GRPC_PORT",
    defaultPort: 54317,
    health: "tcp"
  },
  {
    name: "otel-collector-http",
    purpose: "OpenTelemetry OTLP HTTP receiver",
    env: "NELYO_LOCAL_OTEL_HTTP_PORT",
    defaultPort: 54318,
    health: "tcp"
  },
  {
    name: "otel-collector-health",
    purpose: "OpenTelemetry Collector health endpoint",
    env: "NELYO_LOCAL_OTEL_HEALTH_PORT",
    defaultPort: 51333,
    health: "http",
    path: "/"
  }
];

export function parsePort(value, fallback, label = "port") {
  if (value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1024 || parsed > 65535) {
    throw new Error(`${label} must be an integer from 1024 through 65535.`);
  }

  return parsed;
}

export function localInfraConfig(env = process.env) {
  const services = serviceDefinitions.map((service) => ({
    ...service,
    host: "127.0.0.1",
    port: parsePort(env[service.env], service.defaultPort, service.env)
  }));

  return {
    projectName: composeProjectName,
    composeFile,
    otelConfigFile,
    services,
    images: imagePins
  };
}

export function validateStaticConfig(config = localInfraConfig()) {
  const failures = [];
  const compose = fs.readFileSync(config.composeFile, "utf8");
  const otelConfig = fs.readFileSync(config.otelConfigFile, "utf8");

  for (const image of config.images) {
    if (!compose.includes(image.image)) {
      failures.push(`Missing pinned image for ${image.name}.`);
    }
    if (!image.image.includes("@sha256:")) {
      failures.push(`Image for ${image.name} must be digest-pinned.`);
    }
    if (image.image.includes(":latest")) {
      failures.push(`Image for ${image.name} must not use latest.`);
    }
  }

  for (const service of config.services) {
    if (!compose.includes(`127.0.0.1:$\{${service.env}:-${service.defaultPort}}`)) {
      failures.push(`Host binding for ${service.name} must use 127.0.0.1 and ${service.env}.`);
    }
  }

  for (const blocked of ["AUTH_TOKEN", "production", "PRODUCTION", "deploy", "release"]) {
    if (compose.includes(blocked) || otelConfig.includes(blocked)) {
      failures.push(`Local harness must not include ${blocked}.`);
    }
  }

  if (!otelConfig.includes("health_check") || !otelConfig.includes("debug:")) {
    failures.push(
      "OpenTelemetry collector config must include local health_check and debug exporter."
    );
  }

  return failures;
}

export function isPortOpen(host, port, timeoutMs = 750) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    const done = (open) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(open);
    };
    socket.setTimeout(timeoutMs);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));
  });
}

export async function findOpenPorts(services = localInfraConfig().services) {
  const conflicts = [];
  for (const service of services) {
    if (await isPortOpen(service.host, service.port)) {
      conflicts.push(service);
    }
  }
  return conflicts;
}

export function dockerAvailability() {
  const docker = spawnSync("docker", ["--version"], { encoding: "utf8" });
  if (docker.error) {
    return {
      available: false,
      message: "Docker CLI is not available on PATH."
    };
  }
  if (docker.status !== 0) {
    return {
      available: false,
      message: (docker.stderr || docker.stdout || "Docker CLI check failed.").trim()
    };
  }

  const compose = spawnSync("docker", ["compose", "version"], { encoding: "utf8" });
  if (compose.error) {
    return {
      available: false,
      message: "Docker Compose plugin is not available."
    };
  }
  if (compose.status !== 0) {
    return {
      available: false,
      message: (compose.stderr || compose.stdout || "Docker Compose check failed.").trim()
    };
  }

  return {
    available: true,
    message: `${docker.stdout.trim()} / ${compose.stdout.trim()}`
  };
}

function composeArgs(args) {
  return ["compose", "-f", composeFile, "--project-name", composeProjectName, ...args];
}

function runDocker(args) {
  const result = spawnSync("docker", args, {
    cwd: rootDir,
    encoding: "utf8",
    stdio: "inherit"
  });
  if (result.error) {
    throw new Error(result.error.message);
  }
  if (result.status !== 0) {
    throw new Error(`docker ${args.join(" ")} failed with exit code ${result.status}.`);
  }
}

async function checkHttp(service, timeoutMs = 1500) {
  return new Promise((resolve) => {
    const request = http.request(
      {
        hostname: service.host,
        port: service.port,
        path: service.path ?? "/",
        method: "GET",
        timeout: timeoutMs
      },
      (response) => {
        response.resume();
        resolve(response.statusCode !== undefined && response.statusCode < 500);
      }
    );
    request.once("timeout", () => {
      request.destroy();
      resolve(false);
    });
    request.once("error", () => resolve(false));
    request.end();
  });
}

async function healthChecks(config = localInfraConfig()) {
  const checks = [];
  for (const service of config.services) {
    const ok =
      service.health === "http"
        ? await checkHttp(service)
        : await isPortOpen(service.host, service.port);
    checks.push({ ...service, ok });
  }
  return checks;
}

async function waitForHealthy(config = localInfraConfig(), attempts = 60) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const checks = await healthChecks(config);
    if (checks.every((check) => check.ok)) {
      return checks;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return healthChecks(config);
}

function printConfig(config = localInfraConfig()) {
  console.log(
    JSON.stringify(
      {
        projectName: config.projectName,
        composeFile: path.relative(rootDir, config.composeFile),
        otelConfigFile: path.relative(rootDir, config.otelConfigFile),
        services: config.services.map(({ name, purpose, host, port, env, health, path }) => ({
          name,
          purpose,
          host,
          port,
          env,
          health,
          path
        })),
        images: config.images.map(({ name, image, version, license }) => ({
          name,
          image,
          version,
          license
        }))
      },
      null,
      2
    )
  );
}

async function commandVerify() {
  const failures = validateStaticConfig();
  if (failures.length > 0) {
    console.error("Local infrastructure static verification failed:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Local infrastructure static verification passed.");
  const docker = dockerAvailability();
  if (!docker.available) {
    console.log(`Docker runtime verification skipped: ${docker.message}`);
  }
}

async function commandDoctor() {
  const docker = dockerAvailability();
  if (!docker.available) {
    console.error(`Local infrastructure doctor failed: ${docker.message}`);
    process.exitCode = 2;
    return;
  }

  console.log(`Docker available: ${docker.message}`);
  runDocker(composeArgs(["config", "--quiet"]));
  console.log("Docker Compose configuration parsed successfully.");
}

async function commandPorts() {
  const conflicts = await findOpenPorts();
  if (conflicts.length > 0) {
    console.error("Local infrastructure port conflicts detected:");
    for (const conflict of conflicts) {
      console.error(`- ${conflict.name}: ${conflict.host}:${conflict.port}`);
    }
    process.exitCode = 3;
    return;
  }
  console.log("Local infrastructure ports are available.");
}

async function commandStart() {
  const docker = dockerAvailability();
  if (!docker.available) {
    console.error(`Local infrastructure start failed: ${docker.message}`);
    process.exitCode = 2;
    return;
  }

  const conflicts = await findOpenPorts();
  if (conflicts.length > 0) {
    console.error("Local infrastructure start refused due to port conflicts:");
    for (const conflict of conflicts) {
      console.error(`- ${conflict.name}: ${conflict.host}:${conflict.port}`);
    }
    process.exitCode = 3;
    return;
  }

  runDocker(composeArgs(["up", "--detach", "--remove-orphans"]));
  const checks = await waitForHealthy();
  if (!checks.every((check) => check.ok)) {
    console.error("Local infrastructure did not become healthy:");
    for (const check of checks) {
      console.error(`- ${check.name}: ${check.ok ? "healthy" : "unhealthy"}`);
    }
    process.exitCode = 4;
    return;
  }
  console.log("Local infrastructure started and health checks passed.");
}

async function commandHealth() {
  const checks = await healthChecks();
  for (const check of checks) {
    console.log(
      `${check.name}: ${check.ok ? "healthy" : "unhealthy"} (${check.host}:${check.port})`
    );
  }
  if (!checks.every((check) => check.ok)) {
    process.exitCode = 4;
  }
}

function commandStop(removeVolumes = false) {
  const docker = dockerAvailability();
  if (!docker.available) {
    console.error(`Local infrastructure stop failed: ${docker.message}`);
    process.exitCode = 2;
    return;
  }

  const args = ["down", "--remove-orphans"];
  if (removeVolumes) {
    args.push("--volumes");
  }
  runDocker(composeArgs(args));
}

async function main() {
  const command = process.argv[2] ?? "help";
  switch (command) {
    case "config":
      printConfig();
      break;
    case "verify":
      await commandVerify();
      break;
    case "doctor":
      await commandDoctor();
      break;
    case "ports":
      await commandPorts();
      break;
    case "start":
      await commandStart();
      break;
    case "health":
      await commandHealth();
      break;
    case "stop":
      commandStop(false);
      break;
    case "reset":
      commandStop(true);
      break;
    default:
      console.log(
        "Usage: node tools/local-infra/local-infra.mjs <config|verify|doctor|ports|start|health|stop|reset>"
      );
      break;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  await main();
}
