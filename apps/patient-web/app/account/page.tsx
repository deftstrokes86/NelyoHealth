import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Card } from "@nelyohealth/ui-foundation";
import { marketingContentById } from "@nelyohealth/content-registry";
import { nestApiBaseUrl } from "../../src/lib/api-base";
import { SESSION_COOKIE_NAME } from "../../src/lib/session-cookie";

export const metadata = { title: "Your account — NelyoHealth" };

interface SessionContextData {
  accountId: string;
  personId: string;
  workspace: string;
  persona: { kind: string; actorRole: string; actorRoles: string[] };
  activeTenantId: string | null;
}

// Server Component: useContent()'s React Context isn't available here, so
// copy is read directly from the registry map (the same pattern layout.tsx
// already uses for non-hook lookups).
const content = (id: string) => marketingContentById.get(id) ?? { title: id, body: "" };

/**
 * Minimal, real authenticated landing page — exercises the full
 * Authenticate -> Resolve ActingContext -> Authorize -> Execute pipeline
 * (M2.2/M2.3) by calling the protected GET /api/session/context endpoint.
 * Deliberately thin: no patient-portal app shell exists yet.
 */
export default async function AccountPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionId) {
    redirect("/sign-in");
  }

  const response = await fetch(`${nestApiBaseUrl()}/api/session/context`, {
    headers: { authorization: `Bearer ${sessionId}` },
    cache: "no-store"
  });

  if (!response.ok) {
    redirect("/sign-in");
  }

  const body = (await response.json()) as { data: SessionContextData };
  const context = body.data;

  const welcomeHeadline = content("account.welcome.headline");
  const welcomeBody = content("account.welcome.body");
  const fieldWorkspace = content("account.field.workspace");
  const fieldActingAs = content("account.field.acting-as");
  const ctaSignOut = content("account.cta.sign-out");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16">
      <Card tone="raised" padding="lg" className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck size={22} strokeWidth={1.9} aria-hidden />
          </span>
          <div>
            <h1 className="text-h4 font-semibold text-foreground">{welcomeHeadline.title}</h1>
            <p className="text-body-sm text-muted-foreground">{welcomeBody.title}</p>
          </div>
        </div>
        <dl className="grid grid-cols-1 gap-3 text-body-sm sm:grid-cols-2">
          <div>
            <dt className="text-caption uppercase text-muted-foreground">{fieldWorkspace.title}</dt>
            <dd className="capitalize text-foreground">{context.workspace}</dd>
          </div>
          <div>
            <dt className="text-caption uppercase text-muted-foreground">{fieldActingAs.title}</dt>
            <dd className="capitalize text-foreground">{context.persona.actorRole}</dd>
          </div>
        </dl>
        <form action="/api/auth/sign-out" method="post">
          <button type="submit" className="nh-button nh-button--secondary">
            {ctaSignOut.title}
          </button>
        </form>
      </Card>
    </div>
  );
}
