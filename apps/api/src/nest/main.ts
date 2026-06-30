import { createNestApiApp } from "./bootstrap.js";

async function main(): Promise<void> {
  const app = await createNestApiApp();
  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, "127.0.0.1");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
