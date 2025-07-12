import { fetchLinkByShorten, logClick } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shorten: string }> }
) {
  const { shorten } = await params;
  const BASE_URL = process.env.BETTER_AUTH_URL;
  const link = await fetchLinkByShorten(shorten);

  if (!link) {
    return NextResponse.redirect(`${BASE_URL}/404`, { status: 302 });
  }

  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  const host = req.headers.get("host") || "unknown";
  const referrer = req.headers.get("referer") || "unknown";

  await logClick(link.id, {
    ip,
    userAgent,
    host,
    referrer,
  });

  return NextResponse.redirect(link.longUrl, { status: 302 });
}
