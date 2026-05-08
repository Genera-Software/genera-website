import PageHeader from "../../_components/PageHeader";
import BlogForm from "../_components/BlogForm";
import { createBlogPost } from "../actions";

export default function NewBlogPostPage() {
  return (
    <div>
      <PageHeader
        title="New blog post"
        back={{ href: "/admin/blog", label: "Back to posts" }}
      />
      <BlogForm action={createBlogPost} submitLabel="Create post" />
    </div>
  );
}
