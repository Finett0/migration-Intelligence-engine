export type Platform = "shopify" | "tray" | "woocommerce" | "loja-integrada" | "outra";

export type RevenueRange = "10k" | "10k-50k" | "50k-100k" | "100k-500k" | "500k+";

export type Pain =
  | "custo"
  | "suporte"
  | "performance"
  | "integracoes"
  | "customizar"
  | "taxas";

export interface CostBreakdown {
  planLabel: string;
  planValue: number;
  txRate: number;
  txLabel: string;
  appsValue: number;
  appsLabel: string;
  nuvemPlan: number;
}

export interface QuickWin {
  icon: string;
  title: string;
  description: string;
}

export interface TimelineStep {
  title: string;
  duration: string;
  description: string;
}

export interface StoreStats {
  products: number;
  categories: number;
  hasBlog: boolean;
  integrations: number;
}

export interface ScrapedData {
  title: string;
  description: string;
  detectedPlatform: string | null;
  productCount: number | null;
  categoryCount: number | null;
  hasBlog: boolean | null;
  integrationCount: number | null;
  hasSSL: boolean;
  technologies: string[];
}

export interface AIInsight {
  summary: string;
  migrationComplexity: "baixa" | "média" | "alta";
  personalizedTips: string[];
}

export interface AnalysisResult {
  platform: Platform;
  revenue: RevenueRange;
  pains: Pain[];
  url: string;
  costs: {
    current: {
      total: number;
      breakdown: CostBreakdown;
      txCost: number;
    };
    nuvemshop: {
      total: number;
    };
    monthlySavings: number;
    annualSavings: number;
  };
  store: StoreStats;
  timeline: TimelineStep[];
  totalDays: number;
  quickWins: QuickWin[];
  scraped?: ScrapedData;
  aiInsight?: AIInsight;
}

export type AppStep = "hero" | "qualification" | "loading" | "report";

export interface AppState {
  step: AppStep;
  url: string;
  platform: Platform | null;
  revenue: RevenueRange | null;
  pains: Set<Pain>;
  result: AnalysisResult | null;
}
