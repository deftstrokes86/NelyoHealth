import Link from "next/link";

export default function ScreenPage() {
  return (
    <main className="nh-shell">
      <section className="nh-shell__header" aria-labelledby="screen-title">
        <h1 id="screen-title">For Diaspora Families</h1>
        <p>Screen ID: MED-PUB-005</p>
        <p>Hard-currency family plans, parent care, sponsor peace of mind.</p>
        <p>
          <Link href="/">Back to Home</Link>
        </p>
      </section>
    </main>
  );
}