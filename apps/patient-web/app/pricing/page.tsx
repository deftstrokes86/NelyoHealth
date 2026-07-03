import Link from "next/link";

export default function ScreenPage() {
  return (
    <main className="nh-shell">
      <section className="nh-shell__header" aria-labelledby="screen-title">
        <h1 id="screen-title">Pricing and Plans</h1>
        <p>Screen ID: MED-PUB-011</p>
        <p>Corporate, HMO, diaspora, pay-per-consult, chronic care tiers.</p>
        <p>
          <Link href="/">Back to Home</Link>
        </p>
      </section>
    </main>
  );
}