"use client";

import type { ReactNode } from "react";
import { ConsentBanner, ConsentDialog } from "@c15t/nextjs";

export default function ConsentManager({ children }: { children: ReactNode }) {
  return (
    <>
      <ConsentBanner />
      <ConsentDialog />
      {children}
    </>
  );
}
