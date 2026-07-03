import Link from "next/link";

export default function ScreenPage() {
  return (
    <main className="nh-shell">
      <section className="nh-shell__header" aria-labelledby="screen-title">
        <h1 id="screen-title">About MediReach</h1>
        <p>Screen ID: MED-PUB-002</p>
        <p>Mission, coordinated care model, Nigerian healthcare context.</p>
        <p>
          <Link href="/">Back to Home</Link>
        </p>
      </section>
    </main>
  );
}