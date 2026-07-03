import Link from "next/link";

export default function ScreenPage() {
  return (
    <main className="nh-shell">
      <section className="nh-shell__header" aria-labelledby="screen-title">
        <h1 id="screen-title">For Hospitals and Specialists</h1>
        <p>Screen ID: MED-PUB-010</p>
        <p>Referral, discharge follow-up, specialist network.</p>
        <p>
          <Link href="/">Back to Home</Link>
        </p>
      </section>
    </main>
  );
}