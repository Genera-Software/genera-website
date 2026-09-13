"use client";

import Image from "next/image";
import { useState } from "react";
import { AdminBusyButton } from "../../_components/AdminBusyButton";

type Initial = {
  quote?: string;
  name?: string;
  role?: string | null;
  business?: string;
  image_url?: string | null;
  video_url?: string | null;
  sort_order?: number;
  is_visible?: boolean;
};

const inputClass =
  "w-full rounded-lg border border-teal-mid bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60";
const labelClass = "mb-1.5 block text-sm font-semibold text-ink";
const hintClass = "mt-1 text-xs text-ink-soft";

export default function TestimonialForm({
  initial,
  action,
  submitLabel,
}: {
  initial?: Initial;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const [preview, setPreview] = useState<string | null>(initial?.image_url ?? null);
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
      <div>
        <label className={labelClass} htmlFor="quote">
          Quote
        </label>
        <textarea
          id="quote"
          name="quote"
          required
          rows={4}
          maxLength={800}
          defaultValue={initial?.quote ?? ""}
          className={inputClass}
        />
        <p className={hintClass}>
          Just the words. The quotation marks are added on the page.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            required
            maxLength={80}
            defaultValue={initial?.name ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="role">
            Role (optional)
          </label>
          <input
            id="role"
            type="text"
            name="role"
            maxLength={80}
            placeholder="e.g. Owner"
            defaultValue={initial?.role ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="business">
            Business
          </label>
          <input
            id="business"
            type="text"
            name="business"
            required
            maxLength={120}
            defaultValue={initial?.business ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="image_file">
          Profile photo (optional)
        </label>
        {preview && (
          <div className="mb-3 flex items-center gap-4 rounded-lg border border-teal-mid bg-cream p-3">
            <Image
              src={preview}
              alt="Current photo"
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover"
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
                Remove current photo
              </label>
            )}
          </div>
        )}
        <input
          id="image_file"
          type="file"
          name="image_file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setPreview(URL.createObjectURL(f));
              setRemoveImage(false);
            }
          }}
          className="block w-full text-sm text-ink file:mr-4 file:rounded-md file:border-0 file:bg-forest-dark file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-forest"
        />
        <p className={hintClass}>
          PNG, JPG or WebP, max 5 MB. A square crop of their face works best. It&apos;s
          shown in a circle. Without a photo, their initials are shown instead.
        </p>
      </div>

      <div>
        <label className={labelClass} htmlFor="video_url">
          Instagram link (optional)
        </label>
        <input
          id="video_url"
          type="text"
          inputMode="url"
          name="video_url"
          maxLength={500}
          placeholder="https://www.instagram.com/reel/…"
          defaultValue={initial?.video_url ?? ""}
          className={inputClass}
        />
        <p className={hintClass}>
          Paste the reel or post link. The photo becomes a play button that opens it
          in a popup. YouTube and Vimeo links work too.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="sort_order">
            Sort order
          </label>
          <input
            id="sort_order"
            type="number"
            name="sort_order"
            min={0}
            step={10}
            defaultValue={initial?.sort_order ?? 0}
            className={inputClass}
          />
          <p className={hintClass}>Lower numbers appear first.</p>
        </div>
        <div>
          <span className={labelClass}>Visibility</span>
          <label className="flex h-[42px] items-center gap-2 rounded-lg border border-teal-mid bg-white px-3">
            <input
              type="checkbox"
              name="is_visible"
              defaultChecked={initial?.is_visible ?? true}
              className="h-4 w-4 rounded border-teal-mid text-gold focus:ring-gold-soft"
            />
            <span className="text-sm text-ink">Show on landing page</span>
          </label>
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <AdminBusyButton type="submit" variant="gold" pending={pending} pendingLabel="Saving…">
          {submitLabel}
        </AdminBusyButton>
      </div>
    </form>
  );
}
