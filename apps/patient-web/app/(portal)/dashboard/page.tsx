import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CalendarClock, Activity, Bell, ShieldCheck } from "lucide-react";
import { Card } from "@nelyohealth/ui-foundation";
import { createPatientApiClient } from "@nelyohealth/api-client";
import { nestApiBaseUrl } from "../../../src/lib/api-base";
import { SESSION_COOKIE_NAME } from "../../../src/lib/session-cookie";
import { MutationButton } from "./mutation-button";

export const metadata = { title: "Your health dashboard — NelyoHealth" };
export const dynamic = "force-dynamic";

function formatWhen(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

/**
 * Patient dashboard (roadmap M7.1). A thin, reads-first shell over the M7 API,
 * entirely through the typed client. It holds NO authorization logic: it renders
 * what the API returns, and because denied and not-found are the same uniform 404,
 * the UI treats them identically (as empty/absent) by construction. Only a 401 on
 * the identity read is actionable — it redirects to sign-in.
 */
export default async function DashboardPage(): Promise<React.JSX.Element> {
  const sessionId = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!sessionId) {
    redirect("/sign-in");
  }

  const client = createPatientApiClient({ baseUrl: nestApiBaseUrl(), sessionToken: sessionId });

  const context = await client.getSessionContext();
  if (context.status === 401 || !context.data) {
    redirect("/sign-in");
  }
  const [timeline, notifications, appointments] = await Promise.all([
    client.getMyTimeline({ limit: 8 }),
    client.getNotifications(),
    client.getMyAppointments({ limit: 8 })
  ]);

  const persona = context.data.persona;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-12">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck size={22} strokeWidth={1.9} aria-hidden />
          </span>
          <div>
            <h1 className="text-h4 font-semibold text-foreground">Your health dashboard</h1>
            <p className="text-body-sm capitalize text-muted-foreground">
              {context.data.workspace} workspace · acting as {persona.actorRole}
            </p>
          </div>
        </div>
        <form action="/api/auth/sign-out" method="post">
          <button type="submit" className="nh-button nh-button--secondary text-body-sm">
            Sign out
          </button>
        </form>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Upcoming appointments (list + cancel; booking arrives with slot discovery). */}
        <Card tone="raised" padding="lg" className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-foreground">
            <CalendarClock size={18} strokeWidth={1.9} aria-hidden />
            <h2 className="text-body font-semibold">Appointments</h2>
          </div>
          {appointments.data && appointments.data.appointments.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {appointments.data.appointments.map((appointment) => (
                <li
                  key={appointment.appointmentId}
                  className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-body-sm font-medium capitalize text-foreground">
                      {appointment.appointmentType} · {appointment.status}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {formatWhen(appointment.scheduledStart)}
                    </p>
                  </div>
                  {appointment.status !== "cancelled" && appointment.status !== "completed" ? (
                    <MutationButton
                      action={`/api/appointments/${appointment.appointmentId}/cancel`}
                      label="Cancel"
                      variant="ghost"
                    />
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body-sm text-muted-foreground">No appointments yet.</p>
          )}
        </Card>

        {/* Notification inbox (list + mark read). */}
        <Card tone="raised" padding="lg" className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-foreground">
            <Bell size={18} strokeWidth={1.9} aria-hidden />
            <h2 className="text-body font-semibold">Notifications</h2>
          </div>
          {notifications.data && notifications.data.notifications.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {notifications.data.notifications.map((notification) => (
                <li
                  key={notification.notificationId}
                  className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-body-sm font-medium text-foreground">
                      {notification.notificationType}
                    </p>
                    <p className="text-caption capitalize text-muted-foreground">
                      {notification.status}
                    </p>
                  </div>
                  {notification.status !== "read" && !notification.readAt ? (
                    <MutationButton
                      action={`/api/notifications/${notification.notificationId}/read`}
                      label="Mark read"
                      variant="ghost"
                    />
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body-sm text-muted-foreground">You're all caught up.</p>
          )}
        </Card>

        {/* Recent timeline (read-only). */}
        <Card tone="raised" padding="lg" className="flex flex-col gap-4 md:col-span-2">
          <div className="flex items-center gap-2 text-foreground">
            <Activity size={18} strokeWidth={1.9} aria-hidden />
            <h2 className="text-body font-semibold">Recent activity</h2>
          </div>
          {timeline.data && timeline.data.entries.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {timeline.data.entries.map((entry) => (
                <li key={entry.entryId} className="flex items-center justify-between gap-3">
                  <span className="text-body-sm capitalize text-foreground">
                    {entry.entryType.replace(/-/g, " ")}
                  </span>
                  <span className="text-caption text-muted-foreground">
                    {formatWhen(entry.occurredAt)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body-sm text-muted-foreground">Nothing recorded yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
