import Link from "next/link";

export default function ScreenPage() {
  return (
    <main className="nh-shell">
      <section className="nh-shell__header" aria-labelledby="screen-title">
        <h1 id="screen-title">For Doctors</h1>
        <p>Screen ID: MED-PUB-006</p>
        <p>Provider recruitment, verification, earnings, clinical standards.</p>
        <p>
          <Link href="/">Back to Home</Link>
        </p>
      </section>
    </main>
  );
}