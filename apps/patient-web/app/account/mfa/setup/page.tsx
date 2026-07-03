import Link from "next/link";

export default function ScreenPage() {
  return (
    <main className="nh-shell">
      <section className="nh-shell__header" aria-labelledby="screen-title">
        <h1 id="screen-title">MFA Setup</h1>
        <p>Screen ID: MED-AUTH-005</p>
        <p>Enroll authenticator, SMS, or email MFA.</p>
        <p>
          <Link href="/">Back to Home</Link>
        </p>
      </section>
    </main>
  );
}