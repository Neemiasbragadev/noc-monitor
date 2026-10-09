import { NextResponse } from "next/server";
import { checarAgora } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await checarAgora();
  return NextResponse.json(status, {
    headers: { "Cache-Control": "no-store" },
  });
}
