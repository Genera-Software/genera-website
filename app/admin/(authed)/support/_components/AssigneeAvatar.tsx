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

/**
 * Several assignees as overlapping avatars, with first names when there's room
 * ("Dihan, Sam +1"). Falls back to the unassigned chip when the list is empty.
 */
export function AssigneeStack({
  emails,
  showName = false,
  staleEmails = [],
  max = 3,
}: {
  emails: string[];
  showName?: boolean;
  /** Assignees who are no longer admins — shown greyed out. */
  staleEmails?: string[];
  max?: number;
}) {
  if (emails.length === 0) {
    return <AssigneeAvatar email={null} showName={showName} />;
  }
  if (emails.length === 1) {
    return (
      <AssigneeAvatar
        email={emails[0]}
        showName={showName}
        stale={staleEmails.includes(emails[0])}
      />
    );
  }

  const shown = emails.slice(0, max);
  const extra = emails.length - shown.length;
  const firstNames = emails.map((e) => assigneeName(e).split(" ")[0]);
  const label =
    firstNames.slice(0, 2).join(", ") +
    (firstNames.length > 2 ? ` +${firstNames.length - 2}` : "");

  return (
    <span
      className="inline-flex items-center gap-2"
      title={emails.join("\n")}
    >
      <span className="flex -space-x-1.5">
        {shown.map((email) => (
          <span
            key={email}
            aria-hidden
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ring-2 ring-white ${
              staleEmails.includes(email)
                ? "bg-cream-dark text-ink-soft"
                : assigneeColour(email)
            }`}
          >
            {assigneeInitials(email)}
          </span>
        ))}
        {extra > 0 && (
          <span
            aria-hidden
            className="flex h-6 w-6 items-center justify-center rounded-full bg-cream text-[10px] font-bold text-ink-soft ring-2 ring-white"
          >
            +{extra}
          </span>
        )}
      </span>
      {showName && <span className="truncate text-xs text-ink">{label}</span>}
      <span className="sr-only">
        Assigned to {emails.map(assigneeName).join(", ")}
      </span>
    </span>
  );
}
