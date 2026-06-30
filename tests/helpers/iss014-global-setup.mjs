import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export default async function globalSetup() {
  const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const authDir = path.join(rootDir, ".artifacts", "playwright-auth");
  const shellApps = [
    "patient-web.signed-out.json",
    "provider-web.signed-out.json",
    "organization-web.signed-out.json",
    "admin-web.signed-out.json"
  ];

  fs.mkdirSync(authDir, { recursive: true });

  for (const fileName of shellApps) {
    const filePath = path.join(authDir, fileName);
    const payload = {
      cookies: [],
      origins: []
    };
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
  }
}
