import Link from "next/link";

export default function ScreenPage() {
  return (
    <main className="nh-shell">
      <section className="nh-shell__header" aria-labelledby="screen-title">
        <h1 id="screen-title">Role Selection</h1>
        <p>Screen ID: MED-AUTH-007</p>
        <p>Select or request platform role.</p>
        <p>
          <Link href="/">Back to Home</Link>
        </p>
      </section>
    </main>
  );
}