import type { Platform, RevenueRange, Pain, AnalysisResult, ScrapedData, AIInsight } from "@/types/report";
import { getCostBreakdown, getQuickWins, getTimeline, getMockStoreStats, REVENUE_MID } from "./data";

export function generateAnalysis(
  url: string,
  platform: Platform,
  revenue: RevenueRange,
  pains: Pain[],
  scraped?: ScrapedData,
  aiInsight?: AIInsight,
): AnalysisResult {
  const breakdown = getCostBreakdown(platform, revenue);
  const gmv = REVENUE_MID[revenue];
  const txCost = Math.round(gmv * breakdown.txRate);
  const currentTotal = breakdown.planValue + txCost + breakdown.appsValue;
  const nuvemTotal = breakdown.nuvemPlan;
  const monthlySavings = currentTotal - nuvemTotal;
  const annualSavings = monthlySavings * 12;

  // Use scraped product count if available, otherwise mock
  const storeStats = getMockStoreStats();
  if (scraped?.productCount) {
    storeStats.products = scraped.productCount;
  }
  if (scraped?.technologies) {
    storeStats.integrations = Math.max(scraped.technologies.length, storeStats.integrations);
  }

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
      const { scraped, aiInsight } = await response.json();
      return generateAnalysis(url, platform, revenue, pains, scraped, aiInsight);
    }
  } catch {
    // Fall back to client-side only
  }

  return generateAnalysis(url, platform, revenue, pains);
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR");
}
