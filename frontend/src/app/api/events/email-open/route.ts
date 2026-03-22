import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { EVENT_POINTS } from "@/lib/scoring";

export const dynamic = "force-dynamic";

// 1x1 transparent PNG
const PIXEL = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);

export async function GET(req: NextRequest) {
  const lid = req.nextUrl.searchParams.get("lid");

  if (lid) {
    try {
      // Deduplicate: only score the first open
      const existingOpen = await prisma.event.findFirst({
        where: { leadId: lid, type: "email_open" },
      });

      if (!existingOpen) {
        await prisma.$transaction([
          prisma.event.create({
            data: { leadId: lid, type: "email_open" },
          }),
          prisma.lead.update({
            where: { id: lid },
            data: { score: { increment: EVENT_POINTS.email_open } },
          }),
        ]);
      }
    } catch (e) {
      console.error("Email open tracking error:", e);
    }
  }

  return new Response(PIXEL, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      "Content-Length": String(PIXEL.length),
    },
  });
}
