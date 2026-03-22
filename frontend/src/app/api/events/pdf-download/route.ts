import { NextRequest } from "next/server";
import { trackEvent } from "@/lib/track";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { leadId } = await req.json();
    if (!leadId) {
      return Response.json({ error: "leadId required" }, { status: 400 });
    }
    await trackEvent(leadId, "pdf_download");
    return Response.json({ success: true });
  } catch (e) {
    console.error("PDF download tracking error:", e);
    return Response.json({ error: "Tracking failed" }, { status: 500 });
  }
}
