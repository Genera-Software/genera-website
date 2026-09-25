import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="rounded-2xl border border-teal-mid bg-white px-8 py-14 text-center">
      <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-cream font-massilia text-mini-h font-bold text-forest">
        404
      </div>
      <h1 className="font-massilia text-section-h font-bold text-forest">
        We could not find that
      </h1>
      <p className="mx-auto mt-3 max-w-[420px] text-meta text-ink-soft">
        This record may have been deleted, or the link you followed is out of
        date.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/admin"
          className="rounded-full bg-gold px-5 py-2 font-massilia text-sm font-bold text-ink shadow-[0_4px_14px_rgba(255,168,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,168,0,0.45)] transition-shadow"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
