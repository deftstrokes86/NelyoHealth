import Link from "next/link";

export default function ScreenPage() {
  return (
    <main className="nh-shell">
      <section className="nh-shell__header" aria-labelledby="screen-title">
        <h1 id="screen-title">For Care Partners</h1>
        <p>Screen ID: MED-PUB-007</p>
        <p>Professional caregivers, agencies, nurses, coordinators.</p>
        <p>
          <Link href="/">Back to Home</Link>
        </p>
      </section>
    </main>
  );
}