import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../../_components/PageHeader";
import ViewToggle from "../_components/ViewToggle";
import KanbanBoard from "./_components/KanbanBoard";
import { setTicketAssignees, setTicketPriority, setTicketStatus } from "../actions";
import { listAdminUsers } from "@/lib/admin/allowlist";
import { isArchived } from "@/lib/support/status";

export const dynamic = "force-dynamic";

export default async function SupportBoardPage() {
  const supabase = getAdminSupabase();

  const [{ data: tickets }, admins] = await Promise.all([
    supabase
      .from("support_tickets")
      .select(
        "id, status, priority, category, subject, account_email, assignees, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(2000),
    listAdminUsers(),
  ]);

  // Same source of truth as the list view and sidebar badge.
  const { data: unreadRows } = await supabase
    .from("support_ticket_messages")
    .select("ticket_id")
    .eq("direction", "inbound")
    .is("read_at", null);
  const unreadIds = [...new Set((unreadRows ?? []).map((r) => r.ticket_id))];
  const unread = new Set(unreadIds);

  // Same archive rule as the list: completed tickets drop off the board unless
  // a customer reply is still unread.
  const onBoard = (tickets ?? []).filter(
    (t) => !isArchived(t.status, unread.has(t.id)),
  );
  const archivedCount = (tickets ?? []).length - onBoard.length;

  return (
    <div data-full-width>
      <PageHeader
        title="Support board"
        description="Drag tickets between columns to change their status."
        action={<ViewToggle active="board" />}
      />

      <KanbanBoard
        tickets={onBoard}
        archivedCount={archivedCount}
        unreadIds={unreadIds}
        admins={admins.map((a) => a.email)}
        onMove={setTicketStatus}
        onPriority={setTicketPriority}
        onAssign={setTicketAssignees}
      />
    </div>
  );
}
