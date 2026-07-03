import Link from "next/link";

export default function ScreenPage() {
  return (
    <main className="nh-shell">
      <section className="nh-shell__header" aria-labelledby="screen-title">
        <h1 id="screen-title">Help Center Landing</h1>
        <p>Screen ID: MED-PUB-014</p>
        <p>Public FAQs and support entry.</p>
        <p>
          <Link href="/">Back to Home</Link>
        </p>
      </section>
    </main>
  );
}