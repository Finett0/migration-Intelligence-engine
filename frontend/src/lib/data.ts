import type {
  Platform,
  RevenueRange,
  CostBreakdown,
  QuickWin,
  TimelineStep,
  StoreStats,
} from "@/types/report";

export const PLATFORM_NAMES: Record<Platform, string> = {
  shopify: "Shopify",
  tray: "Tray",
  woocommerce: "WooCommerce",
  "loja-integrada": "Loja Integrada",
  outra: "Plataforma atual",
};

export const REVENUE_LABELS: Record<RevenueRange, string> = {
  "10k": "Até R$10.000",
  "10k-50k": "R$10.000 — R$50.000",
  "50k-100k": "R$50.000 — R$100.000",
  "100k-500k": "R$100.000 — R$500.000",
  "500k+": "Acima de R$500.000",
};

export const REVENUE_MID: Record<RevenueRange, number> = {
  "10k": 7000,
  "10k-50k": 30000,
  "50k-100k": 75000,
  "100k-500k": 250000,
  "500k+": 750000,
};

const costs: Record<Platform, Record<RevenueRange, CostBreakdown>> = {
  shopify: {
    "10k":      { planLabel: "US$ 79 (~R$ 490)", planValue: 490, txRate: 0.02, txLabel: "~2%", appsValue: 300, appsLabel: "R$ 300", nuvemPlan: 449 },
    "10k-50k":  { planLabel: "US$ 79 (~R$ 490)", planValue: 490, txRate: 0.02, txLabel: "~2%", appsValue: 300, appsLabel: "R$ 300", nuvemPlan: 449 },
    "50k-100k": { planLabel: "US$ 79 (~R$ 490)", planValue: 490, txRate: 0.02, txLabel: "~2%", appsValue: 300, appsLabel: "R$ 300", nuvemPlan: 449 },
    "100k-500k":{ planLabel: "US$ 79 (~R$ 490)", planValue: 490, txRate: 0.02, txLabel: "~2%", appsValue: 300, appsLabel: "R$ 300", nuvemPlan: 449 },
    "500k+":    { planLabel: "US$ 79 (~R$ 490)", planValue: 490, txRate: 0.02, txLabel: "~2%", appsValue: 300, appsLabel: "R$ 300", nuvemPlan: 449 },
  },
  tray: {
    "10k":      { planLabel: "R$ 299", planValue: 299, txRate: 0, txLabel: "0%", appsValue: 100, appsLabel: "R$ 100", nuvemPlan: 449 },
    "10k-50k":  { planLabel: "R$ 599", planValue: 599, txRate: 0, txLabel: "0%", appsValue: 200, appsLabel: "R$ 200", nuvemPlan: 449 },
    "50k-100k": { planLabel: "R$ 999", planValue: 999, txRate: 0, txLabel: "0%", appsValue: 300, appsLabel: "R$ 300", nuvemPlan: 449 },
    "100k-500k":{ planLabel: "R$ 1.499", planValue: 1499, txRate: 0, txLabel: "0%", appsValue: 400, appsLabel: "R$ 400", nuvemPlan: 449 },
    "500k+":    { planLabel: "R$ 2.499", planValue: 2499, txRate: 0, txLabel: "0%", appsValue: 600, appsLabel: "R$ 600", nuvemPlan: 449 },
  },
  woocommerce: {
    "10k":      { planLabel: "Hosting (~R$ 150)", planValue: 150, txRate: 0, txLabel: "0%", appsValue: 200, appsLabel: "R$ 200 (plugins)", nuvemPlan: 449 },
    "10k-50k":  { planLabel: "Hosting (~R$ 300)", planValue: 300, txRate: 0, txLabel: "0%", appsValue: 400, appsLabel: "R$ 400 (plugins)", nuvemPlan: 449 },
    "50k-100k": { planLabel: "Hosting (~R$ 600)", planValue: 600, txRate: 0, txLabel: "0%", appsValue: 600, appsLabel: "R$ 600 (plugins + dev)", nuvemPlan: 449 },
    "100k-500k":{ planLabel: "Hosting (~R$ 1.200)", planValue: 1200, txRate: 0, txLabel: "0%", appsValue: 1500, appsLabel: "R$ 1.500 (dev + plugins)", nuvemPlan: 449 },
    "500k+":    { planLabel: "Hosting (~R$ 2.500)", planValue: 2500, txRate: 0, txLabel: "0%", appsValue: 3000, appsLabel: "R$ 3.000 (dev + infra)", nuvemPlan: 449 },
  },
  "loja-integrada": {
    "10k":      { planLabel: "R$ 99", planValue: 99, txRate: 0, txLabel: "0%", appsValue: 50, appsLabel: "R$ 50", nuvemPlan: 449 },
    "10k-50k":  { planLabel: "R$ 299", planValue: 299, txRate: 0, txLabel: "0%", appsValue: 100, appsLabel: "R$ 100", nuvemPlan: 449 },
    "50k-100k": { planLabel: "R$ 599", planValue: 599, txRate: 0, txLabel: "0%", appsValue: 150, appsLabel: "R$ 150", nuvemPlan: 449 },
    "100k-500k":{ planLabel: "R$ 999", planValue: 999, txRate: 0, txLabel: "0%", appsValue: 200, appsLabel: "R$ 200", nuvemPlan: 449 },
    "500k+":    { planLabel: "R$ 1.499", planValue: 1499, txRate: 0, txLabel: "0%", appsValue: 300, appsLabel: "R$ 300", nuvemPlan: 449 },
  },
  outra: {
    "10k":      { planLabel: "~R$ 200", planValue: 200, txRate: 0.01, txLabel: "~1%", appsValue: 100, appsLabel: "~R$ 100", nuvemPlan: 449 },
    "10k-50k":  { planLabel: "~R$ 500", planValue: 500, txRate: 0.01, txLabel: "~1%", appsValue: 250, appsLabel: "~R$ 250", nuvemPlan: 449 },
    "50k-100k": { planLabel: "~R$ 800", planValue: 800, txRate: 0.01, txLabel: "~1%", appsValue: 400, appsLabel: "~R$ 400", nuvemPlan: 449 },
    "100k-500k":{ planLabel: "~R$ 1.500", planValue: 1500, txRate: 0.01, txLabel: "~1%", appsValue: 600, appsLabel: "~R$ 600", nuvemPlan: 449 },
    "500k+":    { planLabel: "~R$ 3.000", planValue: 3000, txRate: 0.01, txLabel: "~1%", appsValue: 1000, appsLabel: "~R$ 1.000", nuvemPlan: 449 },
  },
};

export function getCostBreakdown(platform: Platform, revenue: RevenueRange): CostBreakdown {
  return costs[platform][revenue];
}

const quickWins: Record<Platform, QuickWin[]> = {
  shopify: [
    { icon: "💳", title: "Pix nativo via Nuvem Pago", description: "Aceite Pix sem instalar apps terceiros pagos. Integração nativa e gratuita." },
    { icon: "🚚", title: "Frete até 60% mais barato", description: "Nuvem Envio com tabelas pré-negociadas com as principais transportadoras do Brasil." },
    { icon: "🇧🇷", title: "Suporte em português", description: "96% de satisfação com suporte humanizado e dedicado, sem depender de fóruns." },
    { icon: "🎨", title: "70+ layouts gratuitos", description: "Templates profissionais e customizáveis sem conhecimento de código." },
    { icon: "💰", title: "Cobrança em reais", description: "Sem surpresas cambiais. Plano fixo em BRL, previsível todo mês." },
    { icon: "🤖", title: "IA ilimitada incluída", description: "Ferramentas de IA para gestão de produtos, campanhas e atendimento." },
  ],
  tray: [
    { icon: "⚡", title: "Performance superior", description: "65% vs 46% em Core Web Vitals. Sua loja carrega mais rápido e converte mais." },
    { icon: "🤖", title: "IA ilimitada", description: "Ferramentas de inteligência artificial para gestão de produtos e campanhas." },
    { icon: "🛒", title: "Checkout 3x mais rápido", description: "Maior taxa de conversão com checkout otimizado e transparente." },
    { icon: "🧩", title: "300+ apps integrados", description: "Ecossistema completo de aplicativos para expandir as funcionalidades da loja." },
    { icon: "🎨", title: "Layouts modernos gratuitos", description: "Templates responsivos e profissionais sem custo adicional." },
    { icon: "🇧🇷", title: "Suporte com 96% de satisfação", description: "Atendimento humanizado e dedicado em português." },
  ],
  woocommerce: [
    { icon: "🔧", title: "Zero manutenção técnica", description: "Sem atualizações de plugins, sem hosting para gerenciar, sem conflitos de versão." },
    { icon: "🔒", title: "Segurança gerenciada", description: "SSL, monitoramento 24/7 e 100% de uptime garantido pela plataforma." },
    { icon: "💳", title: "Pagamentos nativos BR", description: "Pix, boleto e cartão integrados nativamente via Nuvem Pago." },
    { icon: "🚚", title: "Frete integrado", description: "Nuvem Envio com Correios, Jadlog e outras transportadoras já configuradas." },
    { icon: "🇧🇷", title: "Suporte humanizado", description: "Sem depender de fóruns. Equipe dedicada em português com 96% de satisfação." },
    { icon: "📊", title: "100% uptime", description: "Infraestrutura gerenciada. Mesmo na Black Friday, sua loja fica no ar." },
  ],
  "loja-integrada": [
    { icon: "♾️", title: "Sem limites de produtos", description: "Cadastre quantos produtos precisar sem restrições por plano." },
    { icon: "🧩", title: "Integrações avançadas", description: "Ecossistema com mais de 300 apps e integrações disponíveis." },
    { icon: "🤖", title: "IA ilimitada", description: "Ferramentas de IA para marketing, produtos e atendimento sem custo extra." },
    { icon: "👔", title: "Gerente dedicado", description: "No Nuvemshop Next, você tem um gerente de conta exclusivo para sua operação." },
    { icon: "🎨", title: "70+ layouts gratuitos", description: "Templates modernos e customizáveis sem conhecimento técnico." },
    { icon: "🚚", title: "Frete até 60% mais barato", description: "Nuvem Envio com tabelas negociadas e rastreamento automático." },
  ],
  outra: [
    { icon: "🚀", title: "Líder na América Latina", description: "Mais de 180 mil lojas ativas e infraestrutura otimizada para o mercado brasileiro." },
    { icon: "💳", title: "Nuvem Pago integrado", description: "Pix, boleto e cartão sem taxas de transação adicionais." },
    { icon: "🚚", title: "Nuvem Envio", description: "Frete com até 60% de desconto e rastreamento automático." },
    { icon: "🤖", title: "IA ilimitada", description: "Ferramentas de inteligência artificial para gestão completa da loja." },
    { icon: "🎨", title: "70+ layouts gratuitos", description: "Templates profissionais e responsivos, customizáveis sem código." },
    { icon: "🇧🇷", title: "Suporte dedicado", description: "Equipe brasileira com 96% de satisfação e atendimento humanizado." },
  ],
};

export function getQuickWins(platform: Platform): QuickWin[] {
  return quickWins[platform];
}

export function getTimeline(): TimelineStep[] {
  return [
    { title: "Migração de catálogo", duration: "~3 dias", description: "Produtos, categorias, imagens e variações" },
    { title: "Configuração de layout", duration: "~5 dias", description: "Tema, personalização visual e páginas" },
    { title: "Integrações (pagamento e frete)", duration: "~3 dias", description: "Nuvem Pago, Nuvem Envio e ERP" },
    { title: "Testes e ajustes", duration: "~7 dias", description: "Checkout, fluxos e validações" },
    { title: "Redirects SEO e lançamento", duration: "~7 dias", description: "301 redirects, DNS e go-live" },
  ];
}

export function getMockStoreStats(): StoreStats {
  return {
    products: 420,
    categories: 18,
    hasBlog: true,
    integrations: 3,
  };
}

export const PAIN_OPTIONS: { value: string; label: string }[] = [
  { value: "custo", label: "Custo alto" },
  { value: "suporte", label: "Suporte ruim" },
  { value: "performance", label: "Performance lenta" },
  { value: "integracoes", label: "Poucas integrações" },
  { value: "customizar", label: "Difícil de customizar" },
  { value: "taxas", label: "Taxas de transação" },
];
