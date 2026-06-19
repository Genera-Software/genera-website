"use client";

import Image from "next/image";
import { useState } from "react";
import { AdminBusyButton } from "../../_components/AdminBusyButton";

type Initial = {
  slug?: string;
  num?: number;
  title?: string;
  tagline?: string;
  intro?: string | null;
  image_url?: string | null;
  image_alt?: string | null;
  is_published?: boolean;
  sort_order?: number;
};

const inputCls =
  "w-full rounded-lg border border-teal-mid bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60";

export default function SectionMetaForm({
  initial,
  action,
  submitLabel,
}: {
  initial?: Initial;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const [preview, setPreview] = useState<string | null>(
    initial?.image_url ?? null,
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  return (
    <form
      action={async (fd) => {
        setPending(true);
        setError(null);
        try {
          await action(fd);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setPending(false);
        }
      }}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Title
          </label>
          <input
            type="text"
            name="title"
            required
            maxLength={120}
            defaultValue={initial?.title ?? ""}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Section number
          </label>
          <input
            type="number"
            name="num"
            min={0}
            defaultValue={initial?.num ?? 0}
            className={inputCls}
          />
          <p className="mt-1 text-xs text-ink-soft">
            The “SECTION 0X” label on the page.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Slug
          </label>
          <input
            type="text"
            name="slug"
            required
            maxLength={80}
            defaultValue={initial?.slug ?? ""}
            placeholder="dashboard"
            className={`${inputCls} font-mono`}
          />
          <p className="mt-1 text-xs text-ink-soft">
            The URL: <code>/docs/&lt;slug&gt;</code>. Lowercase, dashes only.
            Changing it changes the public link.
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Tagline
          </label>
          <input
            type="text"
            name="tagline"
            maxLength={200}
            defaultValue={initial?.tagline ?? ""}
            className={inputCls}
          />
          <p className="mt-1 text-xs text-ink-soft">
            One-liner on cards and the sidebar.
          </p>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Intro
        </label>
        <textarea
          name="intro"
          maxLength={2000}
          rows={3}
          defaultValue={initial?.intro ?? ""}
          className={inputCls}
        />
        <p className="mt-1 text-xs text-ink-soft">
          Longer intro shown at the top of the section page (optional).
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Hero image (optional)
        </label>
        {preview && (
          <div className="mb-3 flex items-center gap-3 rounded-lg border border-teal-mid bg-cream p-3">
            <Image
              src={preview}
              alt="Current hero"
              width={160}
              height={100}
              className="h-20 w-32 rounded object-cover"
              unoptimized
            />
            {initial?.image_url && (
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  name="remove_image"
                  checked={removeImage}
                  onChange={(e) => {
                    setRemoveImage(e.target.checked);
                    if (e.target.checked) setPreview(null);
                  }}
                  className="h-4 w-4 rounded border-teal-mid text-gold focus:ring-gold-soft"
                />
                Remove current image
              </label>
            )}
          </div>
        )}
        <input
          type="file"
          name="image_file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setPreview(URL.createObjectURL(f));
              setRemoveImage(false);
            }
          }}
          className="block w-full text-sm text-ink file:mr-4 file:rounded-md file:border-0 file:bg-forest-dark file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-forest"
        />
        <input
          type="text"
          name="image_alt"
          maxLength={300}
          defaultValue={initial?.image_alt ?? ""}
          placeholder="Alt text for the hero image"
          className={`${inputCls} mt-2`}
        />
        <p className="mt-1 text-xs text-ink-soft">
          PNG, JPG, WebP or SVG. Max 5 MB. Stored in the website-images bucket.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Sort order
          </label>
          <input
            type="number"
            name="sort_order"
            min={0}
            defaultValue={initial?.sort_order ?? 0}
            className={inputCls}
          />
          <p className="mt-1 text-xs text-ink-soft">Lower appears first.</p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Visibility
          </label>
          <label className="flex h-[42px] items-center gap-2 rounded-lg border border-teal-mid bg-white px-3">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={initial?.is_published ?? true}
              className="h-4 w-4 rounded border-teal-mid text-gold focus:ring-gold-soft"
            />
            <span className="text-sm text-ink">Show in the Help Centre</span>
          </label>
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <AdminBusyButton
          type="submit"
          variant="gold"
          pending={pending}
          pendingLabel="Saving…"
        >
          {submitLabel}
        </AdminBusyButton>
      </div>
    </form>
  );
}
