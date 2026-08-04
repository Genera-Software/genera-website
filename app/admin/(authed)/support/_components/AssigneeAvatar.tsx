import {
  assigneeColour,
  assigneeInitials,
  assigneeName,
} from "@/lib/support/assignee";

/**
 * Compact assignee chip for tables and board cards. `stale` marks someone who
 * still holds the ticket but is no longer an admin — shouldn't normally happen
 * (removal unassigns), but a direct DB edit could leave one behind.
 */
export default function AssigneeAvatar({
  email,
  showName = false,
  stale = false,
}: {
  email: string | null;
  showName?: boolean;
  stale?: boolean;
}) {
  if (!email) {
    return (
      <span className="inline-flex items-center gap-2 text-ink-soft/70">
        <span
          aria-hidden
          className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-cream-dark text-[10px]"
        >
          —
        </span>
        {showName && <span className="text-xs">Unassigned</span>}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-2"
      title={stale ? `${email} — no longer an admin` : email}
    >
      <span
        aria-hidden
        className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
          stale ? "bg-cream-dark text-ink-soft" : assigneeColour(email)
        }`}
      >
        {assigneeInitials(email)}
      </span>
      {showName && (
        <span
          className={`truncate text-xs ${stale ? "text-ink-soft/70 line-through" : "text-ink"}`}
        >
          {assigneeName(email)}
        </span>
      )}
      <span className="sr-only">
        Assigned to {assigneeName(email)}
        {stale ? " (no longer an admin)" : ""}
      </span>
    </span>
  );
}
