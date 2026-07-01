export const iss014ShellApps = [
  {
    appName: "patient-web",
    packageName: "@nelyohealth/patient-web",
    heading: "Patient Web Shell",
    authStateFile: "patient-web.signed-out.json",
    port: 4311
  },
  {
    appName: "provider-web",
    packageName: "@nelyohealth/provider-web",
    heading: "Provider Web Shell",
    authStateFile: "provider-web.signed-out.json",
    port: 4312
  },
  {
    appName: "organization-web",
    packageName: "@nelyohealth/organization-web",
    heading: "Organization Web Shell",
    authStateFile: "organization-web.signed-out.json",
    port: 4313
  },
  {
    appName: "admin-web",
    packageName: "@nelyohealth/admin-web",
    heading: "Admin Web Shell",
    authStateFile: "admin-web.signed-out.json",
    port: 4314
  }
] as const;

export type Iss014ShellApp = (typeof iss014ShellApps)[number];

export function getIss014ShellAppByProjectName(projectName: string): Iss014ShellApp {
  const shellApp = iss014ShellApps.find(
    (entry) => entry.appName === projectName.split("-")[0] + "-web"
  );
  if (!shellApp) {
    throw new Error(`Unknown ISS-014 shell project: ${projectName}`);
  }
  return shellApp;
}
