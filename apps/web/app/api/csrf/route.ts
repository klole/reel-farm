import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const current = cookieStore.get("oss_csrf")?.value;
  const token = current && /^[A-Za-z0-9_-]{32,128}$/.test(current) ? current : randomBytes(32).toString("base64url");
  const response = NextResponse.json({ token });
  response.cookies.set("oss_csrf", token, { httpOnly: false, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
  return response;
}
