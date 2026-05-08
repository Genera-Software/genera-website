import type { Metadata } from "next";
import Paw from "@/components/Paw";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const params = await searchParams;
  const from =
    params.from && params.from.startsWith("/admin") ? params.from : "/admin";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-4 py-10">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-[63%_37%_54%_46%/55%_48%_52%_45%] bg-gold/10"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-20 h-[320px] w-[320px] rounded-[40%_60%_55%_45%/48%_52%_48%_52%] bg-white/5"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-forest-dark/60 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm">
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-gold/50 bg-white/10 px-3 py-1 font-caveat text-[1rem] font-bold text-gold-soft">
            <Paw className="h-[1.1em] w-[1.1em]" /> Genera CMS
          </div>
          <h1 className="font-poppins text-2xl font-extrabold text-white">
            Sign in to admin
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Manage your site content.
          </p>
        </div>
        <LoginForm from={from} />
      </div>
    </main>
  );
}
