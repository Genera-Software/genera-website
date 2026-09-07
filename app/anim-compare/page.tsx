import AdminMiniAnimation from "@/components/AdminMiniAnimation";
import AdminMiniAnimationV2 from "@/components/AdminMiniAnimationV2";

/* Side-by-side comparison harness. Not linked from anywhere. */
function Frame({
  label,
  note,
  children,
}: {
  label: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline gap-3">
        <span className="font-massilia text-lg font-bold text-forest">{label}</span>
        <span className="text-meta text-ink-soft">{note}</span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-teal-mid/50 bg-white shadow-[0_18px_40px_rgba(0,62,69,0.16)]">
        <div className="flex items-center gap-2 border-b border-cream-dark bg-cream px-3 py-2">
          <span className="block h-3 w-3 rounded-full bg-[#FF6058]" />
          <span className="block h-3 w-3 rounded-full bg-[#FFBD2E]" />
          <span className="block h-3 w-3 rounded-full bg-[#28C940]" />
          <span className="ml-2 rounded-md bg-white px-3 py-1 text-xs text-ink-soft">
            app.generasoftware.com
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AnimComparePage() {
  return (
    <main className="min-h-screen bg-cream px-6 py-8">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-10">
        <div>
          <p className="font-caveat text-2xl text-forest">Hero animation, old and new</p>
          <p className="mt-1 max-w-[70ch] text-meta text-ink-soft">
            Both loop on their own. Version one has six views and was built from the
            help docs. Version two has nine and was built from the live app.
          </p>
        </div>

        <Frame
          label="Version 1"
          note="Currently on the homepage · 6 views · 25s · built from the docs"
        >
          <AdminMiniAnimation />
        </Frame>

        <Frame
          label="Version 2"
          note="New · 9 views · 27s · built from the live app"
        >
          <AdminMiniAnimationV2 />
        </Frame>
      </div>
    </main>
  );
}
