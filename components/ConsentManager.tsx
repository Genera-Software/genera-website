"use client";

import type { ReactNode } from "react";
import { ConsentBanner, ConsentDialog } from "@c15t/nextjs";
import MetaPixelConsentSync from "@/components/MetaPixelConsentSync";

// The pixel is mounted wherever the banner is: the public site, not /admin or /docs.
export default function ConsentManager({ children }: { children: ReactNode }) {
  return (
    <>
      <ConsentBanner />
      <ConsentDialog />
      <MetaPixelConsentSync />
      {children}
    </>
  );
}
