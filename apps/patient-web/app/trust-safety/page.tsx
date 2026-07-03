import Link from "next/link";

export default function ScreenPage() {
  return (
    <main className="nh-shell">
      <section className="nh-shell__header" aria-labelledby="screen-title">
        <h1 id="screen-title">Trust and Safety</h1>
        <p>Screen ID: MED-PUB-013</p>
        <p>Doctor verification, consent, privacy, clinical escalation.</p>
        <p>
          <Link href="/">Back to Home</Link>
        </p>
      </section>
    </main>
  );
}