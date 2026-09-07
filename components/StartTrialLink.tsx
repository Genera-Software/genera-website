import { ReactNode } from "react";
import { START_TRIAL_CTA_LABEL } from "@/lib/cta";
import { REGISTER_URL } from "@/lib/urls";
import { registerUrlForTier } from "@/lib/pricing";

type Props = {
  className?: string;
  children?: ReactNode;
  /** platform_plans UUID — signup starts the subscription on that tier. Omit for no preference. */
  tierId?: string;
};

/**
 * The primary CTA everywhere the Founding 100 application used to sit. A plain anchor rather
 * than next/link because signup lives on the app origin, not this site.
 */
export default function StartTrialLink({
  className = "btn btn-gold btn-lg",
  children = START_TRIAL_CTA_LABEL,
  tierId,
}: Props) {
  return (
    <a
      href={tierId ? registerUrlForTier(tierId) : REGISTER_URL}
      className={className}
    >
      {children}
    </a>
  );
}
