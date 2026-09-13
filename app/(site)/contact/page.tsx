import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { BOOK_DEMO_FORM_SLUG } from "@/lib/cta";
import { isFormActive } from "@/lib/forms";
import { TRIAL_DAYS } from "@/lib/pricing";
import ContactClient from "./ContactClient";

export const revalidate = 60;

export const metadata: Metadata = {
  ...createMetadata({
    title: "Contact Genera About Pricing, Plans and Getting Started",
    description:
      "Contact Genera to ask about pet business management features, pricing and plans, switching from another system, or getting help with your account.",
    path: "/contact",
  }),
};

export default async function ContactPage() {
  const showBookDemo = await isFormActive(BOOK_DEMO_FORM_SLUG);
  return <ContactClient showBookDemo={showBookDemo} trialDays={TRIAL_DAYS} />;
}
