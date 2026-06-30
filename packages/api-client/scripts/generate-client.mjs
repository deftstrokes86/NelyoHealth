#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import openapiTS, { astToString } from "openapi-typescript";

const packageDir = process.cwd();
const openApiPath = path.join(packageDir, "openapi", "openapi.json");
const generatedDir = path.join(packageDir, "src", "generated");
const outputTypesPath = path.join(generatedDir, "openapi-types.ts");
const outputClientPath = path.join(generatedDir, "client.ts");

if (!fs.existsSync(openApiPath)) {
  console.error("OpenAPI document not found. Run pnpm openapi:generate first.");
  process.exit(1);
}

fs.mkdirSync(generatedDir, { recursive: true });

const schema = JSON.parse(fs.readFileSync(openApiPath, "utf8"));
const ast = await openapiTS(schema);
fs.writeFileSync(outputTypesPath, `${astToString(ast)}\n`, "utf8");

const clientSource = `import createClient from "openapi-fetch";\nimport type { paths } from "./openapi-types.js";\n\nexport type ApiClient = ReturnType<typeof createApiClient>;\n\nexport function createApiClient(baseUrl: string) {\n  return createClient<paths>({\n    baseUrl\n  });\n}\n`;

fs.writeFileSync(outputClientPath, clientSource, "utf8");

console.log(`OpenAPI types generated: ${path.relative(packageDir, outputTypesPath)}`);
console.log(`Typed client generated: ${path.relative(packageDir, outputClientPath)}`);
