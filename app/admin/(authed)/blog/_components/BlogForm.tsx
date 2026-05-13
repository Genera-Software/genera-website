"use client";

import Image from "next/image";
import { useState } from "react";
import { AdminBusyButton } from "../../_components/AdminBusyButton";
import RichTextEditor from "../../_components/RichTextEditor";

type Initial = {
  title?: string;
  slug?: string;
  excerpt?: string;
  body_html?: string;
  author_name?: string;
  category?: string;
  read_time_minutes?: number;
  is_published?: boolean;
  published_at?: string | null;
  cover_image_url?: string | null;
};

function isoToLocalDateTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function autoSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['""]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type ActionResult = { ok: true } | { ok: false; error: string };

export default function BlogForm({
  initial,
  action,
  submitLabel,
}: {
  initial?: Initial;
  action: (formData: FormData) => Promise<ActionResult | void>;
  submitLabel: string;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initial?.cover_image_url ?? null,
  );
  const [removeCover, setRemoveCover] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={async (fd) => {
        setPending(true);
        setError(null);
        try {
          const result = await action(fd);
          if (result && result.ok === false) {
            setError(result.error);
            setPending(false);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Save failed");
          setPending(false);
        }
      }}
      className="grid gap-6 lg:grid-cols-[2fr_1fr]"
    >
      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Title
          </label>
          <input
            type="text"
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(autoSlug(e.target.value));
            }}
            className="w-full rounded-lg border border-teal-mid bg-white px-3 py-2.5 text-base font-semibold shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Slug
          </label>
          <div className="flex items-center rounded-lg border border-teal-mid bg-white shadow-sm focus-within:border-gold focus-within:ring-2 focus-within:ring-gold-soft/60">
            <span className="border-r border-teal-mid px-3 py-2.5 text-sm text-ink-soft">
              /blog/
            </span>
            <input
              type="text"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              className="flex-1 rounded-r-lg px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <p className="mt-1 text-xs text-ink-soft">
            Lowercase letters, numbers, and dashes only.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Excerpt
          </label>
          <textarea
            name="excerpt"
            rows={3}
            maxLength={500}
            defaultValue={initial?.excerpt ?? ""}
            className="w-full rounded-lg border border-teal-mid bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60"
          />
          <p className="mt-1 text-xs text-ink-soft">
            Shown on the blog listing card and as the meta description.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Body
          </label>
          <RichTextEditor
            name="body_html"
            initialHtml={initial?.body_html ?? ""}
            uploadEndpoint="/admin/api/upload-image"
            placeholder="Write your post…"
          />
        </div>
      </div>

      <aside className="flex flex-col gap-5 rounded-2xl border border-teal-mid bg-cream p-5">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Cover image
          </label>
          {coverPreview && (
            <div className="mb-3 overflow-hidden rounded-lg border border-teal-mid bg-white">
              <Image
                src={coverPreview}
                alt="Cover preview"
                width={400}
                height={225}
                className="h-32 w-full object-cover"
                unoptimized
              />
            </div>
          )}
          {initial?.cover_image_url && (
            <label className="mb-2 flex items-center gap-2 text-xs text-ink-soft">
              <input
                type="checkbox"
                name="remove_cover"
                checked={removeCover}
                onChange={(e) => {
                  setRemoveCover(e.target.checked);
                  if (e.target.checked) setCoverPreview(null);
                }}
                className="h-3.5 w-3.5 rounded border-teal-mid text-gold focus:ring-gold-soft"
              />
              Remove current cover
            </label>
          )}
          <input
            type="file"
            name="cover_file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setCoverPreview(URL.createObjectURL(f));
                setRemoveCover(false);
              }
            }}
            className="block w-full text-xs text-ink file:mr-3 file:rounded-md file:border-0 file:bg-forest-dark file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-forest"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink">
              Author
            </label>
            <input
              type="text"
              name="author_name"
              defaultValue={initial?.author_name ?? "Genera"}
              maxLength={80}
              className="w-full rounded-lg border border-teal-mid bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink">
              Read time (min)
            </label>
            <input
              type="number"
              name="read_time_minutes"
              min={1}
              max={120}
              defaultValue={initial?.read_time_minutes ?? 3}
              className="w-full rounded-lg border border-teal-mid bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink">
            Category
          </label>
          <input
            type="text"
            name="category"
            defaultValue={initial?.category ?? "Insights"}
            maxLength={60}
            className="w-full rounded-lg border border-teal-mid bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink">
            Publish date
          </label>
          <input
            type="datetime-local"
            name="published_at"
            defaultValue={isoToLocalDateTime(initial?.published_at)}
            className="w-full rounded-lg border border-teal-mid bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60"
          />
          <p className="mt-1 text-xs text-ink-soft">
            Leave blank to use the current time when publishing.
          </p>
        </div>

        <label className="flex items-center gap-2 rounded-lg border border-teal-mid bg-white px-3 py-2.5">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={initial?.is_published ?? false}
            className="h-4 w-4 rounded border-teal-mid text-gold focus:ring-gold-soft"
          />
          <span className="text-sm font-medium text-ink">Published</span>
        </label>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <AdminBusyButton
          type="submit"
          variant="gold"
          pending={pending}
          pendingLabel="Saving…"
        >
          {submitLabel}
        </AdminBusyButton>
      </aside>
    </form>
  );
}
