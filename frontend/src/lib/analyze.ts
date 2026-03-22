import type { Platform, RevenueRange, Pain, AnalysisResult, ScrapedData, AIInsight } from "@/types/report";
import { getCostBreakdown, getQuickWins, getTimeline, getMockStoreStats, REVENUE_MID } from "./data";

export function generateAnalysis(
  url: string,
  platform: Platform,
  revenue: RevenueRange,
  pains: Pain[],
  scraped?: ScrapedData,
  aiInsight?: AIInsight,
  leadId?: string | null,
): AnalysisResult {
  const breakdown = getCostBreakdown(platform, revenue);
  const gmv = REVENUE_MID[revenue];
  // Shopify always shows R$ 1.588,71 as total cost
  const SHOPIFY_FIXED_TOTAL = 1588.71;
  const txCost = platform === "shopify"
    ? Math.round((SHOPIFY_FIXED_TOTAL - breakdown.planValue - breakdown.appsValue) * 100) / 100
    : Math.round(gmv * breakdown.txRate);
  const currentTotal = platform === "shopify"
    ? SHOPIFY_FIXED_TOTAL
    : breakdown.planValue + txCost + breakdown.appsValue;
  const nuvemTotal = breakdown.nuvemPlan;
  const monthlySavings = currentTotal - nuvemTotal;
  const annualSavings = monthlySavings * 12;

  // Use real scraped data when available, fall back to estimates
  const fallback = getMockStoreStats();
  const storeStats = {
    products: scraped?.productCount ?? fallback.products,
    categories: scraped?.categoryCount ?? fallback.categories,
    hasBlog: scraped?.hasBlog ?? fallback.hasBlog,
    integrations: scraped?.integrationCount ?? (scraped?.technologies?.length || fallback.integrations),
  };

  return {
    platform,
    revenue,
    pains,
    url,
    costs: {
      current: {
        total: currentTotal,
        breakdown,
        txCost,
      },
      nuvemshop: {
        total: nuvemTotal,
      },
      monthlySavings,
      annualSavings,
    },
    store: storeStats,
    timeline: getTimeline(),
    totalDays: 25,
    quickWins: getQuickWins(platform),
    scraped,
    aiInsight,
    leadId: leadId ?? null,
  };
}

export async function fetchAnalysis(
  url: string,
  platform: Platform,
  revenue: RevenueRange,
  pains: Pain[],
): Promise<AnalysisResult> {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, platform, revenue, pains }),
    });

    if (response.ok) {
      const { scraped, aiInsight, leadId } = await response.json();
      return generateAnalysis(url, platform, revenue, pains, scraped, aiInsight, leadId);
    }
  } catch {
    // Fall back to client-side only
  }

  return generateAnalysis(url, platform, revenue, pains);
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR");
}
