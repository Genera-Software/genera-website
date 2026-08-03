import Link from "next/link";

/** Segmented List / Board switch shared by the two support views. */
export default function ViewToggle({ active }: { active: "list" | "board" }) {
  const base =
    "rounded-md px-3 py-1 text-xs font-semibold transition-colors";
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-teal-mid bg-white p-0.5">
      <Link
        href="/admin/support"
        className={`${base} ${
          active === "list"
            ? "bg-forest text-white"
            : "text-ink-soft hover:bg-cream"
        }`}
      >
        List
      </Link>
      <Link
        href="/admin/support/board"
        className={`${base} ${
          active === "board"
            ? "bg-forest text-white"
            : "text-ink-soft hover:bg-cream"
        }`}
      >
        Board
      </Link>
    </div>
  );
}
