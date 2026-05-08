"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect, useRef, useState } from "react";

type Props = {
  name: string;
  initialHtml?: string;
  uploadEndpoint?: string; // e.g. /admin/api/upload-image (returns { url })
  placeholder?: string;
};

export default function RichTextEditor({
  name,
  initialHtml = "",
  uploadEndpoint,
  placeholder = "Write something…",
}: Props) {
  const [html, setHtml] = useState(initialHtml);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener", target: "_blank" },
      }),
      Image.configure({ inline: false, allowBase64: false }),
    ],
    content: initialHtml || `<p></p>`,
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose-editor min-h-[300px] max-w-none px-4 py-4 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  function setLink() {
    const previous = editor?.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().unsetLink().run();
      return;
    }
    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }

  async function handleUpload(file: File) {
    if (!uploadEndpoint) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(uploadEndpoint, { method: "POST", body: fd });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }
      const json = (await res.json()) as { url: string };
      editor?.chain().focus().setImage({ src: json.url }).run();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  if (!editor) {
    return (
      <div className="rounded-lg border border-teal-mid bg-cream p-4 text-sm text-ink-soft">
        Loading editor…
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-teal-mid bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-teal-mid bg-cream px-2 py-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <em>I</em>
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet list"
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered list"
        >
          1. List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Quote"
        >
          &ldquo; &rdquo;
        </ToolbarButton>
        <Divider />
        <ToolbarButton onClick={setLink} active={editor.isActive("link")} title="Link">
          🔗 Link
        </ToolbarButton>
        {uploadEndpoint && (
          <>
            <ToolbarButton
              onClick={() => fileInputRef.current?.click()}
              title="Insert image"
            >
              {uploading ? "Uploading…" : "🖼 Image"}
            </ToolbarButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
              }}
            />
          </>
        )}
        <Divider />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          ↶
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          ↷
        </ToolbarButton>
      </div>
      <EditorContent
        editor={editor}
        aria-placeholder={placeholder}
        className="prose-editor-host"
      />
      <input type="hidden" name={name} value={html} />

      <style>{`
        .prose-editor:focus { outline: none; }
        .prose-editor p { margin: 0 0 1em; }
        .prose-editor h2 { font-family: var(--font-poppins, inherit); font-size: 1.5rem; font-weight: 800; margin: 1.4em 0 0.5em; color: #0f172a; }
        .prose-editor h3 { font-family: var(--font-poppins, inherit); font-size: 1.2rem; font-weight: 700; margin: 1.2em 0 0.4em; color: #0f172a; }
        .prose-editor ul { list-style: disc; padding-left: 1.5em; margin: 0.8em 0; }
        .prose-editor ol { list-style: decimal; padding-left: 1.5em; margin: 0.8em 0; }
        .prose-editor a { color: #003E45; text-decoration: underline; text-decoration-color: #C8880A; text-underline-offset: 2px; font-weight: 600; }
        .prose-editor blockquote { border-left: 4px solid #C8880A; padding-left: 1em; margin: 1em 0; font-style: italic; color: #475569; }
        .prose-editor img { max-width: 100%; border-radius: 12px; margin: 1em 0; }
        .prose-editor strong { color: #0f172a; }
      `}</style>
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex h-8 min-w-[34px] items-center justify-center rounded-md border px-2 text-xs font-semibold transition-colors ${
        active
          ? "border-gold bg-gold-light text-forest"
          : "border-transparent text-ink hover:border-teal-mid hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-cream-dark" />;
}
