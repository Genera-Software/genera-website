"use client";

import Image from "next/image";
import { useState } from "react";
import { AdminBusyButton } from "../../_components/AdminBusyButton";

type DocItem = { label: string; desc: string };
type DocImage = {
  src: string;
  alt: string;
  caption?: string;
  placeholder?: boolean;
};

type ImageRow = {
  id: string;
  src: string; // existing URL (empty for a brand-new upload / placeholder)
  alt: string;
  caption: string;
  placeholder: boolean;
  file: File | null;
  preview: string | null;
};

type Initial = {
  title?: string;
  route?: string | null;
  what_it_does?: string | null;
  how_to_use?: string[];
  items?: DocItem[];
  images?: DocImage[];
  is_published?: boolean;
  sort_order?: number;
};

const inputCls =
  "w-full rounded-lg border border-teal-mid bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60";

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Math.round(performance.now() * 1000));

export default function SubsectionForm({
  initial,
  action,
  submitLabel,
}: {
  initial?: Initial;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [route, setRoute] = useState(initial?.route ?? "");
  const [whatItDoes, setWhatItDoes] = useState(initial?.what_it_does ?? "");
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? true);
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);

  const [howToUse, setHowToUse] = useState<string[]>(initial?.how_to_use ?? []);
  const [items, setItems] = useState<DocItem[]>(initial?.items ?? []);
  const [images, setImages] = useState<ImageRow[]>(
    (initial?.images ?? []).map((im) => ({
      id: uid(),
      src: im.src ?? "",
      alt: im.alt ?? "",
      caption: im.caption ?? "",
      placeholder: !!im.placeholder,
      file: null,
      preview: im.placeholder ? null : im.src || null,
    })),
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("title", title);
      fd.set("route", route ?? "");
      fd.set("what_it_does", whatItDoes ?? "");
      fd.set("is_published", isPublished ? "true" : "false");
      fd.set("sort_order", String(sortOrder));
      fd.set(
        "how_to_use",
        JSON.stringify(howToUse.map((s) => s.trim()).filter(Boolean)),
      );
      fd.set(
        "items",
        JSON.stringify(
          items.filter((it) => it.label.trim() || it.desc.trim()),
        ),
      );

      const metas = images.map((im, i) => {
        const hasFile = !!im.file;
        if (hasFile) fd.set(`image_file_${i}`, im.file as File);
        return {
          src: hasFile ? "" : im.src,
          alt: im.alt,
          caption: im.caption,
          placeholder: im.placeholder,
          fileIndex: hasFile ? i : null,
        };
      });
      fd.set("images_meta", JSON.stringify(metas));

      await action(fd);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPending(false);
    }
  }

  const moveImage = (idx: number, dir: -1 | 1) => {
    setImages((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Basics */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Title
          </label>
          <input
            type="text"
            required
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
          />
          <p className="mt-1 text-xs text-ink-soft">
            For What&apos;s New, use a dated title e.g. “June 2026 — …”.
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Route chip (optional)
          </label>
          <input
            type="text"
            maxLength={200}
            value={route ?? ""}
            onChange={(e) => setRoute(e.target.value)}
            placeholder="/admin/home"
            className={`${inputCls} font-mono`}
          />
          <p className="mt-1 text-xs text-ink-soft">
            Shown as a chip; “/…” paths link to the live app.
          </p>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          What it does (optional)
        </label>
        <textarea
          rows={3}
          maxLength={4000}
          value={whatItDoes ?? ""}
          onChange={(e) => setWhatItDoes(e.target.value)}
          className={inputCls}
        />
      </div>

      {/* How to use */}
      <StringListEditor
        label="How to use it — steps"
        addLabel="+ Add step"
        placeholder="Describe a step…"
        values={howToUse}
        onChange={setHowToUse}
      />

      {/* Items */}
      <ItemListEditor items={items} onChange={setItems} />

      {/* Images */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-semibold text-ink">
            Images / screenshots
          </label>
          <button
            type="button"
            onClick={() =>
              setImages((p) => [
                ...p,
                {
                  id: uid(),
                  src: "",
                  alt: "",
                  caption: "",
                  placeholder: false,
                  file: null,
                  preview: null,
                },
              ])
            }
            className="rounded-md border border-teal-mid px-2.5 py-1 text-xs font-semibold text-ink hover:border-forest"
          >
            + Add image
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {images.map((im, i) => (
            <div
              key={im.id}
              className="grid gap-3 rounded-xl border border-teal-mid bg-cream/50 p-3 sm:grid-cols-[120px_1fr_auto]"
            >
              <div className="flex flex-col items-center gap-2">
                {im.preview && !im.placeholder ? (
                  <Image
                    src={im.preview}
                    alt="Preview"
                    width={120}
                    height={80}
                    className="h-20 w-full rounded object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-20 w-full items-center justify-center rounded border border-dashed border-teal-mid bg-white text-center text-[10px] text-ink-soft">
                    {im.placeholder ? "Placeholder" : "No image"}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setImages((prev) =>
                      prev.map((row) =>
                        row.id === im.id
                          ? {
                              ...row,
                              file: f,
                              preview: f
                                ? URL.createObjectURL(f)
                                : row.preview,
                              placeholder: f ? false : row.placeholder,
                            }
                          : row,
                      ),
                    );
                  }}
                  className="block w-full text-[11px] text-ink file:mr-2 file:rounded file:border-0 file:bg-forest-dark file:px-2 file:py-1 file:text-[11px] file:font-semibold file:text-white hover:file:bg-forest"
                />
              </div>

              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={im.alt}
                  onChange={(e) =>
                    setImages((prev) =>
                      prev.map((row) =>
                        row.id === im.id
                          ? { ...row, alt: e.target.value }
                          : row,
                      ),
                    )
                  }
                  placeholder="Alt text (accessibility)"
                  className={`${inputCls} py-2`}
                />
                <input
                  type="text"
                  value={im.caption}
                  onChange={(e) =>
                    setImages((prev) =>
                      prev.map((row) =>
                        row.id === im.id
                          ? { ...row, caption: e.target.value }
                          : row,
                      ),
                    )
                  }
                  placeholder="Caption — use “Title — description” for a bold lead"
                  className={`${inputCls} py-2`}
                />
                <label className="flex items-center gap-2 text-xs text-ink-soft">
                  <input
                    type="checkbox"
                    checked={im.placeholder}
                    onChange={(e) =>
                      setImages((prev) =>
                        prev.map((row) =>
                          row.id === im.id
                            ? {
                                ...row,
                                placeholder: e.target.checked,
                                ...(e.target.checked
                                  ? { file: null, preview: null }
                                  : {}),
                              }
                            : row,
                        ),
                      )
                    }
                    className="h-4 w-4 rounded border-teal-mid text-gold focus:ring-gold-soft"
                  />
                  Show “Screenshot coming soon” placeholder instead of an image
                </label>
              </div>

              <div className="flex flex-row gap-1 sm:flex-col">
                <button
                  type="button"
                  onClick={() => moveImage(i, -1)}
                  title="Move up"
                  className="rounded border border-teal-mid p-1 text-ink-soft hover:border-forest hover:text-ink"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(i, 1)}
                  title="Move down"
                  className="rounded border border-teal-mid p-1 text-ink-soft hover:border-forest hover:text-ink"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setImages((prev) => prev.filter((row) => row.id !== im.id))
                  }
                  title="Remove image"
                  className="rounded border border-red-200 p-1 text-red-600 hover:bg-red-50"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <p className="rounded-lg border border-dashed border-teal-mid bg-white px-3 py-4 text-center text-xs text-ink-soft">
              No images. Add a screenshot, or a placeholder for one coming soon.
            </p>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Sort order
          </label>
          <input
            type="number"
            min={0}
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
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
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-teal-mid text-gold focus:ring-gold-soft"
            />
            <span className="text-sm text-ink">Show on the docs page</span>
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

function StringListEditor({
  label,
  addLabel,
  placeholder,
  values,
  onChange,
}: {
  label: string;
  addLabel: string;
  placeholder: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...values];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-semibold text-ink">{label}</label>
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="rounded-md border border-teal-mid px-2.5 py-1 text-xs font-semibold text-ink hover:border-forest"
        >
          {addLabel}
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {values.map((val, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-2.5 text-xs font-semibold text-ink-soft">
              {i + 1}.
            </span>
            <textarea
              rows={2}
              value={val}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
              placeholder={placeholder}
              className="w-full rounded-lg border border-teal-mid bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60"
            />
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                className="rounded border border-teal-mid px-1.5 text-xs text-ink-soft hover:border-forest"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                className="rounded border border-teal-mid px-1.5 text-xs text-ink-soft hover:border-forest"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(values.filter((_, k) => k !== i))}
                className="rounded border border-red-200 px-1.5 text-xs text-red-600 hover:bg-red-50"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {values.length === 0 && (
          <p className="rounded-lg border border-dashed border-teal-mid bg-white px-3 py-3 text-center text-xs text-ink-soft">
            None yet.
          </p>
        )}
      </div>
    </div>
  );
}

function ItemListEditor({
  items,
  onChange,
}: {
  items: DocItem[];
  onChange: (v: DocItem[]) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-semibold text-ink">
          Definition list (label → description)
        </label>
        <button
          type="button"
          onClick={() => onChange([...items, { label: "", desc: "" }])}
          className="rounded-md border border-teal-mid px-2.5 py-1 text-xs font-semibold text-ink hover:border-forest"
        >
          + Add row
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((it, i) => (
          <div
            key={i}
            className="grid gap-2 rounded-lg border border-teal-mid bg-cream/50 p-2.5 sm:grid-cols-[180px_1fr_auto]"
          >
            <input
              type="text"
              value={it.label}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...next[i], label: e.target.value };
                onChange(next);
              }}
              placeholder="Label"
              className="rounded-lg border border-teal-mid bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60"
            />
            <input
              type="text"
              value={it.desc}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...next[i], desc: e.target.value };
                onChange(next);
              }}
              placeholder="Description"
              className="rounded-lg border border-teal-mid bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, k) => k !== i))}
              className="self-center rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
            >
              ✕
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="rounded-lg border border-dashed border-teal-mid bg-white px-3 py-3 text-center text-xs text-ink-soft">
            None yet.
          </p>
        )}
      </div>
    </div>
  );
}
