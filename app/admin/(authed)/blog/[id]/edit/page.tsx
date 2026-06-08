import { notFound } from "next/navigation";
import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../../../_components/PageHeader";
import BlogForm from "../../_components/BlogForm";
import { updateBlogPost } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getAdminSupabase();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!post) notFound();

  const updateAction = async (formData: FormData) => {
    "use server";
    return updateBlogPost(post.id, formData);
  };

  return (
    <div>
      <PageHeader
        title="Edit post"
        description={`/blog/${post.slug}`}
        back={{ href: "/admin/blog", label: "Back to posts" }}
      />
      <BlogForm
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          body_html: post.body_html,
          author_name: post.author_name,
          category: post.category,
          read_time_minutes: post.read_time_minutes,
          is_published: post.is_published,
          published_at: post.published_at,
          cover_image_url: post.cover_image_url,
        }}
        action={updateAction}
        submitLabel="Save changes"
      />
    </div>
  );
}
