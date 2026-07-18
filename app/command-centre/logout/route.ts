import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CCC_COOKIE_NAME } from "@/lib/command-centre/session";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete(CCC_COOKIE_NAME);
  return NextResponse.redirect(new URL("/command-centre/login", request.url), {
    status: 303,
  });
}
