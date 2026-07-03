import Link from "next/link";

export default function ScreenPage() {
  return (
    <main className="nh-shell">
      <section className="nh-shell__header" aria-labelledby="screen-title">
        <h1 id="screen-title">Unified Login</h1>
        <p>Screen ID: MED-AUTH-001</p>
        <p>Login for all roles with role-aware redirect.</p>
        <p>
          <Link href="/">Back to Home</Link>
        </p>
      </section>
    </main>
  );
}