import { createNestApiApp } from "./bootstrap.js";

async function main(): Promise<void> {
  const app = await createNestApiApp();
  const port = Number(process.env.PORT ?? 4000);
  // Default stays loopback for local native runs; containers set HOST=0.0.0.0.
  const host = process.env.HOST ?? "127.0.0.1";
  await app.listen(port, host);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
