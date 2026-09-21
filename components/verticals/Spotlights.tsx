"use client";

import {
  AssessmentsShowcase,
  BookingsShowcase,
  CapacityAnimation,
  DailyScheduleShowcase,
  Feature,
  FinanceAnimation,
  InvoicingShowcase,
  RecordsAnimation,
  RoutesShowcase,
  TeamShowcase,
} from "@/app/(site)/features/FeaturesClient";
import BrandedAppShowcase from "@/components/showcase/BrandedAppShowcase";
import LiveChatShowcase from "@/components/showcase/LiveChatShowcase";
import type { ShowcaseKey, VerticalSpotlight } from "@/lib/verticals";

/* ============================================================
   The drawn screens from /features, placed on a vertical page.
   Nothing is redrawn here: each key maps to the same component
   the features page shows, so a screen looks identical wherever
   a visitor meets it. Copy comes from lib/verticals.ts.
   ============================================================ */

const SCREENS: Record<ShowcaseKey, () => React.JSX.Element> = {
  bookings: BookingsShowcase,
  invoicing: InvoicingShowcase,
  routes: RoutesShowcase,
  daily: DailyScheduleShowcase,
  assessments: AssessmentsShowcase,
  team: TeamShowcase,
  capacity: CapacityAnimation,
  finance: FinanceAnimation,
  records: RecordsAnimation,
  ownerApp: BrandedAppShowcase,
  chat: LiveChatShowcase,
};

export default function Spotlights({ items }: { items: VerticalSpotlight[] }) {
  return (
    <div className="mx-auto max-w-[1200px]">
      {items.map((sp) => {
        const Screen = SCREENS[sp.showcase];
        return (
          <Feature
            key={sp.showcase}
            id={sp.showcase}
            feature={sp.feature}
            eyebrow={sp.eyebrow}
            plan={sp.plan}
            onlyOnGenera={sp.onlyOnGenera}
            title={sp.title}
            lead={sp.lead}
            bullets={sp.bullets}
            flip={sp.flip}
          >
            <Screen />
          </Feature>
        );
      })}
    </div>
  );
}
