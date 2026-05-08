import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME } from "@/lib/admin/session";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return NextResponse.redirect(new URL("/admin/login", request.url), {
    status: 303,
  });
}
