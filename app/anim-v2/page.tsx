import AdminMiniAnimationV2 from "@/components/AdminMiniAnimationV2";

/* Preview harness for the v2 hero animation. Not linked from anywhere.
   Add ?v=services (or any view key) to hold one view still. */
export default function AnimV2Preview() {
  return (
    <main className="min-h-screen bg-cream p-6">
      <div className="mx-auto max-w-[1180px]">
        <p className="mb-3 font-caveat text-xl text-forest">Hero animation v2</p>
        <div className="overflow-hidden rounded-2xl border border-teal-mid/50 bg-white shadow-[0_18px_40px_rgba(0,62,69,0.16)]">
          <div className="flex items-center gap-2 border-b border-cream-dark bg-cream px-3 py-2">
            <span className="block h-3 w-3 rounded-full bg-[#FF6058]" />
            <span className="block h-3 w-3 rounded-full bg-[#FFBD2E]" />
            <span className="block h-3 w-3 rounded-full bg-[#28C940]" />
            <span className="ml-2 rounded-md bg-white px-3 py-1 text-xs text-ink-soft">
              app.generasoftware.com
            </span>
          </div>
          <AdminMiniAnimationV2 />
        </div>
      </div>
    </main>
  );
}
