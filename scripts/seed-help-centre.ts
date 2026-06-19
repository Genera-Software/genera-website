/*
 * One-off seed: populate the help_centre_sections / help_centre_subsections
 * tables from the static SECTIONS in app/docs/_data/sections.ts.
 *
 * Idempotent — wipes both tables and re-inserts, so it can be re-run to reset
 * the Help Centre back to the code-defined baseline.
 *
 * Run:  node --experimental-strip-types scripts/seed-help-centre.ts
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { SECTIONS } from "../app/docs/_data/sections.ts";

function loadEnv(file: string): Record<string, string> {
  const out: Record<string, string> = {};
  let raw = "";
  try {
    raw = readFileSync(file, "utf8");
  } catch {
    return out;
  }
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[m[1]] = val;
  }
  return out;
}

const env = { ...loadEnv(".env"), ...loadEnv(".env.local"), ...process.env };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env",
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  // Wipe (cascade clears subsections via FK).
  const { error: delErr } = await supabase
    .from("help_centre_sections")
    .delete()
    .gte("num", -1);
  if (delErr) throw new Error(`Clear failed: ${delErr.message}`);

  let secCount = 0;
  let subCount = 0;

  for (let s = 0; s < SECTIONS.length; s++) {
    const sec = SECTIONS[s];
    const { data: insertedSec, error: secErr } = await supabase
      .from("help_centre_sections")
      .insert({
        slug: sec.slug,
        num: sec.num,
        title: sec.title,
        tagline: sec.tagline ?? "",
        intro: sec.intro ?? null,
        image_url: sec.image ?? null,
        image_alt: sec.imageAlt ?? null,
        is_published: true,
        sort_order: s,
      })
      .select("id")
      .single();
    if (secErr || !insertedSec)
      throw new Error(`Section ${sec.slug} failed: ${secErr?.message}`);
    secCount++;

    const subRows = sec.subsections.map((sub, i) => ({
      section_id: insertedSec.id,
      title: sub.title,
      route: sub.route ?? null,
      what_it_does: sub.whatItDoes ?? null,
      how_to_use: sub.howToUse ?? [],
      items: sub.items ?? [],
      images: sub.images ?? [],
      sort_order: i,
      is_published: true,
    }));

    if (subRows.length) {
      const { error: subErr } = await supabase
        .from("help_centre_subsections")
        .insert(subRows);
      if (subErr)
        throw new Error(`Subsections for ${sec.slug} failed: ${subErr.message}`);
      subCount += subRows.length;
    }
  }

  console.log(`Seeded ${secCount} sections, ${subCount} subsections.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
