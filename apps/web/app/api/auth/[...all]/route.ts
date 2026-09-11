import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../src/lib/auth";
import { assertMutationRequest, jsonError } from "../../../../src/lib/request";

export const runtime = "nodejs";
const handler = toNextJsHandler(auth);

function isPublicSignup(request: NextRequest): boolean {
  return request.nextUrl.pathname.endsWith("/sign-up/email");
}

export async function GET(request: NextRequest) {
  if (isPublicSignup(request)) return NextResponse.json({ error: "Signup is disabled; use private owner setup." }, { status: 404 });
  return handler.GET(request);
}

export async function POST(request: NextRequest) {
  if (isPublicSignup(request)) return NextResponse.json({ error: "Signup is disabled; use private owner setup." }, { status: 404 });
  try { await assertMutationRequest(request); return handler.POST(request); } catch (error) { return jsonError(error); }
}
