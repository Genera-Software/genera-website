import { readFileSync } from "fs";
import { join } from "path";

export function GET() {
  const html = readFileSync(
    join(process.cwd(), "public/customerportal/index.html")
  );
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
