import { notFound } from "next/navigation";
import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../../../../../_components/PageHeader";
import QuestionForm from "../../../../_components/QuestionForm";
import { updateQuestion } from "../../../../actions";

export const dynamic = "force-dynamic";

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string; qid: string }>;
}) {
  const { id, qid } = await params;
  const supabase = getAdminSupabase();

  const { data: form } = await supabase
    .from("forms")
    .select("id, name")
    .eq("id", id)
    .maybeSingle();
  if (!form) notFound();

  const { data: q } = await supabase
    .from("form_questions")
    .select("*")
    .eq("id", qid)
    .eq("form_id", id)
    .maybeSingle();
  if (!q) notFound();

  const action = async (formData: FormData) => {
    "use server";
    await updateQuestion(form.id, q.id, formData);
  };

  return (
    <div>
      <PageHeader
        title="Edit question"
        description={`Form: ${form.name}`}
        back={{
          href: `/admin/forms/${form.id}/edit`,
          label: "Back to form",
        }}
      />
      <div className="rounded-2xl border border-teal-mid bg-white p-6">
        <QuestionForm
          initial={{
            key: q.key,
            label: q.label,
            eyebrow: q.eyebrow,
            hint: q.hint,
            type: q.type,
            placeholder: q.placeholder,
            choices: Array.isArray(q.choices) ? (q.choices as string[]) : [],
            is_optional: q.is_optional,
            sort_order: q.sort_order,
          }}
          action={action}
          submitLabel="Save question"
        />
      </div>
    </div>
  );
}
