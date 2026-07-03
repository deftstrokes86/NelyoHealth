import Link from "next/link";

export default function ScreenPage() {
  return (
    <main className="nh-shell">
      <section className="nh-shell__header" aria-labelledby="screen-title">
        <h1 id="screen-title">For HMOs</h1>
        <p>Screen ID: MED-PUB-004</p>
        <p>HMO dashboard, member access, utilization reporting, API narrative.</p>
        <p>
          <Link href="/">Back to Home</Link>
        </p>
      </section>
    </main>
  );
}