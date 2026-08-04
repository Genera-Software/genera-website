import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../../_components/PageHeader";
import ViewToggle from "../_components/ViewToggle";
import KanbanBoard from "./_components/KanbanBoard";
import { setTicketAssignee, setTicketPriority, setTicketStatus } from "../actions";
import { listAdminUsers } from "@/lib/admin/allowlist";

export const dynamic = "force-dynamic";

export default async function SupportBoardPage() {
  const supabase = getAdminSupabase();

  const [{ data: tickets }, admins] = await Promise.all([
    supabase
      .from("support_tickets")
      .select(
        "id, status, priority, category, subject, account_email, assigned_to, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(300),
    listAdminUsers(),
  ]);

  // Same source of truth as the list view and sidebar badge.
  const { data: unreadRows } = await supabase
    .from("support_ticket_messages")
    .select("ticket_id")
    .eq("direction", "inbound")
    .is("read_at", null);
  const unreadIds = [...new Set((unreadRows ?? []).map((r) => r.ticket_id))];

  return (
    <div data-full-width>
      <PageHeader
        title="Support board"
        description="Drag tickets between columns to change their status."
      />

      <div className="mb-5">
        <ViewToggle active="board" />
      </div>

      <KanbanBoard
        tickets={tickets ?? []}
        unreadIds={unreadIds}
        admins={admins.map((a) => a.email)}
        onMove={setTicketStatus}
        onPriority={setTicketPriority}
        onAssign={setTicketAssignee}
      />
    </div>
  );
}
