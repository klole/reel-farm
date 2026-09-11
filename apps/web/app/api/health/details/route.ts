import { NextResponse } from "next/server";
import { jsonError, requireOwner } from "../../../../src/lib/request";
import { workerStatus } from "../../../../src/lib/domain";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try { await requireOwner(request); return NextResponse.json(await workerStatus()); } catch (error) { return jsonError(error); }
}
