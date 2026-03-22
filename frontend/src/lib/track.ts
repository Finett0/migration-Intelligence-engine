import { prisma } from "./prisma";
import { EVENT_POINTS } from "./scoring";

export type EventType = "analysis" | "pdf_download" | "email_sent" | "email_open";

export async function trackEvent(
  leadId: string,
  type: EventType,
  metadata?: object,
) {
  const points = EVENT_POINTS[type] ?? 0;

  await prisma.$transaction([
    prisma.event.create({
      data: { leadId, type, metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined },
    }),
    prisma.lead.update({
      where: { id: leadId },
      data: { score: { increment: points } },
    }),
  ]);
}

export async function upsertLead(data: {
  url: string;
  email?: string | null;
  phone?: string | null;
  platform?: string | null;
  revenue?: string | null;
  pains?: string[];
  storeTitle?: string | null;
}) {
  const existing = await prisma.lead.findFirst({
    where: { url: data.url, email: data.email ?? null },
  });

  if (existing) {
    return prisma.lead.update({
      where: { id: existing.id },
      data: {
        platform: data.platform ?? existing.platform,
        revenue: data.revenue ?? existing.revenue,
        pains: data.pains ?? existing.pains,
        storeTitle: data.storeTitle ?? existing.storeTitle,
        phone: data.phone ?? existing.phone,
      },
    });
  }

  return prisma.lead.create({
    data: {
      url: data.url,
      email: data.email ?? null,
      phone: data.phone ?? null,
      platform: data.platform ?? null,
      revenue: data.revenue ?? null,
      pains: data.pains ?? [],
      storeTitle: data.storeTitle ?? null,
    },
  });
}
