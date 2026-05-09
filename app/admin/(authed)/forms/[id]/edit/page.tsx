import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../../../_components/PageHeader";
import FormPreview from "../../_components/FormPreview";
import FormSettingsForm from "../../_components/FormSettingsForm";
import NewQuestionModalButton from "../../_components/NewQuestionModalButton";
import SubmissionRow from "../../_components/SubmissionRow";
import TestWebhookButton from "../../_components/TestWebhookButton";
import {
  createQuestion,
  deleteQuestion,
  deleteSubmission,
  moveQuestion,
  updateForm,
} from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getAdminSupabase();

  const { data: form } = await supabase
    .from("forms")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!form) notFound();

  const { data: questions } = await supabase
    .from("form_questions")
    .select(
      "id, key, label, eyebrow, hint, type, placeholder, choices, is_optional, sort_order",
    )
    .eq("form_id", id)
    .order("sort_order", { ascending: true });

  const { data: submissions } = await supabase
    .from("form_submissions")
    .select(
      "id, created_at, payload, webhook_status, webhook_status_code, email_status",
    )
    .eq("form_id", id)
    .order("created_at", { ascending: false })
    .limit(100);

  const updateAction = async (formData: FormData) => {
    "use server";
    await updateForm(form.id, formData);
  };

  const newQuestionAction = async (formData: FormData) => {
    "use server";
    await createQuestion(form.id, formData);
  };

  const qSummaries = (questions ?? []).map((q) => ({
    key: q.key,
    label: q.label,
  }));

  const previewQuestions = (questions ?? []).map((q) => ({
    key: q.key,
    eyebrow: q.eyebrow,
    label: q.label,
    hint: q.hint,
    type: q.type,
    placeholder: q.placeholder,
    choices: Array.isArray(q.choices) ? (q.choices as string[]) : [],
    is_optional: q.is_optional,
  }));

  return (
    <div className="space-y-10">
      <PageHeader
        title={form.name}
        description={`Slug: /api/forms/${form.slug}`}
        back={{ href: "/admin/forms", label: "Back to forms" }}
      />

      <section className="rounded-2xl border border-teal-mid bg-white p-6">
        <h2 className="mb-1 font-poppins text-lg font-extrabold text-ink">
          Settings
        </h2>
        <p className="mb-5 text-sm text-ink-soft">
          Webhook URL, email notifications, and the success message users see
          after they submit.
        </p>
        <FormSettingsForm
          initial={{
            slug: form.slug,
            name: form.name,
            description: form.description,
            success_title: form.success_title,
            success_message: form.success_message,
            webhook_url: form.webhook_url,
            webhook_secret: form.webhook_secret,
            webhook_meta:
              form.webhook_meta && typeof form.webhook_meta === "object"
                ? (form.webhook_meta as Record<string, unknown>)
                : null,
            notify_email: form.notify_email,
            email_subject: form.email_subject,
            is_active: form.is_active,
          }}
          action={updateAction}
          submitLabel="Save settings"
          slugLocked
        />
        {form.webhook_url && (
          <div className="mt-5 border-t border-cream-dark pt-5">
            <h3 className="mb-2 text-sm font-semibold text-ink">
              Test webhook
            </h3>
            <p className="mb-3 text-xs text-ink-soft">
              Sends a test payload (with <code>test: true</code>) to your
              webhook URL.
            </p>
            <TestWebhookButton formId={form.id} />
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-poppins text-lg font-extrabold text-ink">
            Live preview
          </h2>
          <p className="text-xs text-ink-soft">
            Saved questions only — save above to refresh.
          </p>
        </div>
        <FormPreview
          questions={previewQuestions}
          successTitle={form.success_title}
          successMessage={form.success_message}
        />
      </section>

      <section className="rounded-2xl border border-teal-mid bg-white p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-poppins text-lg font-extrabold text-ink">
              Questions
            </h2>
            <p className="text-sm text-ink-soft">
              Shown one at a time in the modal. Reorder with the arrows.
            </p>
          </div>
          <NewQuestionModalButton action={newQuestionAction} />
        </div>

        <div className="overflow-hidden rounded-xl border border-cream-dark">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wider text-ink-soft">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Question</th>
                <th className="px-5 py-3">Key</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {(questions ?? []).map((q) => (
                <tr key={q.id} className="hover:bg-cream/60">
                  <td className="px-5 py-3 align-middle">
                    <div className="flex items-center gap-1">
                      <form
                        action={async () => {
                          "use server";
                          await moveQuestion(form.id, q.id, "up");
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded p-1 text-ink-soft/70 hover:bg-cream-dark hover:text-ink"
                          title="Move up"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        </button>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await moveQuestion(form.id, q.id, "down");
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded p-1 text-ink-soft/70 hover:bg-cream-dark hover:text-ink"
                          title="Move down"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                      </form>
                      <span className="ml-2 text-xs text-ink-soft/70">
                        {q.sort_order}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 align-middle">
                    <Link
                      href={`/admin/forms/${form.id}/questions/${q.id}/edit`}
                      className="font-medium text-ink hover:text-forest"
                    >
                      {q.label}
                    </Link>
                    {q.is_optional && (
                      <span className="ml-2 align-middle text-xs text-ink-soft">
                        (optional)
                      </span>
                    )}
                    {q.hint && (
                      <p className="mt-0.5 text-xs text-ink-soft">{q.hint}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 align-middle font-mono text-xs text-ink-soft">
                    {q.key}
                  </td>
                  <td className="px-5 py-3 align-middle">
                    <span className="rounded-full bg-cream-dark px-2.5 py-0.5 text-xs font-semibold text-ink">
                      {q.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right align-middle">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/admin/forms/${form.id}/questions/${q.id}/edit`}
                        className="rounded-md border border-teal-mid px-3 py-1.5 text-xs font-semibold text-ink hover:border-forest"
                      >
                        Edit
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteQuestion(form.id, q.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {(questions ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-sm text-ink-soft"
                  >
                    No questions yet. Click &ldquo;New question&rdquo; to add
                    the first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-teal-mid bg-white p-6">
        <div className="mb-5">
          <h2 className="font-poppins text-lg font-extrabold text-ink">
            Submissions
          </h2>
          <p className="text-sm text-ink-soft">
            Last 100 entries. Webhook delivery status is recorded per row.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-cream-dark">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wider text-ink-soft">
              <tr>
                <th className="px-5 py-3">When</th>
                <th className="px-5 py-3">Summary</th>
                <th className="px-5 py-3">Webhook</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {(submissions ?? []).map((s) => (
                <SubmissionRow
                  key={s.id}
                  id={s.id}
                  createdAt={s.created_at}
                  payload={(s.payload as Record<string, unknown>) ?? {}}
                  webhookStatus={s.webhook_status}
                  webhookCode={s.webhook_status_code ?? null}
                  emailStatus={s.email_status}
                  questions={qSummaries}
                />
              ))}
              {(submissions ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-sm text-ink-soft"
                  >
                    No submissions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {(submissions ?? []).length > 0 && (
          <form
            action={async (fd) => {
              "use server";
              const sid = String(fd.get("submission_id") ?? "");
              if (sid) await deleteSubmission(form.id, sid);
            }}
            className="mt-4 flex items-center gap-2 text-xs text-ink-soft"
          >
            {/* Per-row delete is intentionally omitted to keep the table clean.
                Use the submission id (visible when expanded) below to delete. */}
            <label htmlFor="submission_id" className="font-semibold">
              Delete submission by id:
            </label>
            <input
              id="submission_id"
              name="submission_id"
              type="text"
              placeholder="paste id…"
              className="rounded-md border border-teal-mid bg-white px-2 py-1 font-mono text-xs"
            />
            <button
              type="submit"
              className="rounded-md border border-red-200 px-2.5 py-1 font-semibold text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
