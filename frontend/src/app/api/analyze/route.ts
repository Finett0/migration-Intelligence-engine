import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import Anthropic from "@anthropic-ai/sdk";
import type { ScrapedData, AIInsight } from "@/types/report";

// ── Scraping ────────────────────────────────────────────────────

const PLATFORM_SIGNATURES: Record<string, string[]> = {
  shopify: ["shopify", "cdn.shopify.com", "myshopify.com"],
  tray: ["tray.com.br", "traycorp", "tray-cdn"],
  woocommerce: ["woocommerce", "wp-content", "wordpress"],
  "loja-integrada": ["lojaintegrada", "loja integrada"],
  vtex: ["vtex", "vteximg"],
  nuvemshop: ["nuvemshop", "lojanuvem", "tiendanube"],
};

function detectPlatform(html: string): string | null {
  const lower = html.toLowerCase();
  for (const [platform, signatures] of Object.entries(PLATFORM_SIGNATURES)) {
    if (signatures.some((sig) => lower.includes(sig))) {
      return platform;
    }
  }
  return null;
}

function detectTechnologies(html: string): string[] {
  const techs: string[] = [];
  const lower = html.toLowerCase();

  if (lower.includes("google-analytics") || lower.includes("gtag")) techs.push("Google Analytics");
  if (lower.includes("gtm.js") || lower.includes("googletagmanager")) techs.push("Google Tag Manager");
  if (lower.includes("facebook") || lower.includes("fbq")) techs.push("Meta Pixel");
  if (lower.includes("hotjar")) techs.push("Hotjar");
  if (lower.includes("rdstation") || lower.includes("rd station")) techs.push("RD Station");
  if (lower.includes("mailchimp")) techs.push("Mailchimp");
  if (lower.includes("hubspot")) techs.push("HubSpot");
  if (lower.includes("tawk.to") || lower.includes("tawk")) techs.push("Tawk.to");
  if (lower.includes("zendesk")) techs.push("Zendesk");
  if (lower.includes("intercom")) techs.push("Intercom");
  if (lower.includes("jquery")) techs.push("jQuery");
  if (lower.includes("bootstrap")) techs.push("Bootstrap");
  if (lower.includes("react")) techs.push("React");

  return techs;
}

async function scrapeStore(url: string): Promise<ScrapedData> {
  const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

  try {
    const response = await fetch(normalizedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(10000),
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $("title").first().text().trim() || $('meta[property="og:title"]').attr("content") || "";
    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "";

    const detectedPlatform = detectPlatform(html);
    const technologies = detectTechnologies(html);

    // Try to estimate product count from structured data or sitemap hints
    let productCount: number | null = null;
    const ldJsonScripts = $('script[type="application/ld+json"]');
    ldJsonScripts.each((_, el) => {
      try {
        const data = JSON.parse($(el).text());
        if (data["@type"] === "Product" || data["@type"] === "ItemList") {
          if (data.numberOfItems) productCount = data.numberOfItems;
        }
      } catch {
        // ignore parse errors
      }
    });

    return {
      title,
      description,
      detectedPlatform,
      productCount,
      hasSSL: normalizedUrl.startsWith("https"),
      technologies,
    };
  } catch {
    return {
      title: "",
      description: "",
      detectedPlatform: null,
      productCount: null,
      hasSSL: url.startsWith("https"),
      technologies: [],
    };
  }
}

// ── LLM (Claude) ───────────────────────────────────────────────

async function generateAIInsight(
  scraped: ScrapedData,
  platform: string,
  revenue: string,
  pains: string[],
  url: string,
): Promise<AIInsight> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return getFallbackInsight(platform, pains);
  }

  const client = new Anthropic({ apiKey });

  const prompt = `Você é um consultor especialista em migração de e-commerce para a Nuvemshop.

Analise os dados abaixo de uma loja virtual e gere um diagnóstico de migração.

**Dados da loja:**
- URL: ${url}
- Título: ${scraped.title || "não detectado"}
- Descrição: ${scraped.description || "não detectada"}
- Plataforma atual: ${platform}
- Plataforma detectada pelo scraping: ${scraped.detectedPlatform || "não detectada"}
- Tecnologias detectadas: ${scraped.technologies.join(", ") || "nenhuma"}
- Faturamento mensal estimado: ${revenue}
- Dores reportadas: ${pains.join(", ")}
- SSL: ${scraped.hasSSL ? "sim" : "não"}

Responda EXCLUSIVAMENTE no formato JSON abaixo (sem markdown, sem code blocks):
{
  "summary": "Um parágrafo de 2-3 frases com um diagnóstico personalizado da loja, mencionando o nome da loja se detectado, e explicando por que a migração para Nuvemshop faz sentido para este caso específico.",
  "migrationComplexity": "baixa" ou "média" ou "alta",
  "personalizedTips": ["dica 1 específica para este merchant", "dica 2", "dica 3"]
}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = JSON.parse(text);

    return {
      summary: parsed.summary,
      migrationComplexity: parsed.migrationComplexity,
      personalizedTips: parsed.personalizedTips,
    };
  } catch {
    return getFallbackInsight(platform, pains);
  }
}

function getFallbackInsight(platform: string, pains: string[]): AIInsight {
  const platformNames: Record<string, string> = {
    shopify: "Shopify",
    tray: "Tray",
    woocommerce: "WooCommerce",
    "loja-integrada": "Loja Integrada",
    outra: "sua plataforma atual",
  };

  const name = platformNames[platform] || "sua plataforma atual";

  const tipsByPain: Record<string, string> = {
    custo: `Ao migrar do ${name}, você elimina custos ocultos como apps pagos e taxas extras. O Nuvem Pago isenta a tarifa de transação da plataforma.`,
    suporte: "Com a Nuvemshop, você tem suporte humanizado em português com 96% de satisfação, incluindo WhatsApp e telefone nos planos avançados.",
    performance: "A Nuvemshop oferece 99,9% de uptime e infraestrutura autoescalável, garantindo performance mesmo em picos como Black Friday.",
    integracoes: "O ecossistema Nuvemshop conta com 300+ apps integrados, incluindo Mercado Livre, Shopee, Amazon e os principais ERPs brasileiros.",
    customizar: "Com 70+ layouts gratuitos e editor visual drag-and-drop, você personaliza sua loja sem precisar de desenvolvedor.",
    taxas: "O Nuvem Pago oferece Pix nativo, boleto a R$ 2,39 fixo e isenção da tarifa de venda da plataforma.",
  };

  const tips = pains.map((p) => tipsByPain[p] || "").filter(Boolean).slice(0, 3);
  if (tips.length === 0) {
    tips.push(
      `A migração do ${name} para a Nuvemshop pode reduzir significativamente seus custos operacionais.`,
      "O Nuvem Envio oferece frete até 60% mais barato com rastreamento integrado.",
      "Ferramentas de IA ilimitadas estão incluídas em todos os planos para gestão de produtos e marketing.",
    );
  }

  return {
    summary: `Com base na análise da sua loja, identificamos que a migração do ${name} para a Nuvemshop pode simplificar sua operação e reduzir custos. As dores que você reportou — ${pains.join(", ")} — são pontos que a Nuvemshop resolve nativamente com seu ecossistema integrado de pagamentos, frete e IA.`,
    migrationComplexity: "média",
    personalizedTips: tips,
  };
}

// ── Route Handler ───────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, platform, revenue, pains } = body;

    if (!url || !platform || !revenue) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Run scraping and prepare for LLM
    const scraped = await scrapeStore(url);

    // Generate AI insight
    const aiInsight = await generateAIInsight(scraped, platform, revenue, pains || [], url);

    return NextResponse.json({ scraped, aiInsight });
  } catch {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
