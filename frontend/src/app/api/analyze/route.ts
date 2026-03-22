import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import Anthropic from "@anthropic-ai/sdk";
import type { ScrapedData, AIInsight } from "@/types/report";

// ── Helpers ─────────────────────────────────────────────────────

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function safeFetch(url: string, timeout = 8000): Promise<Response | null> {
  try {
    return await fetch(url, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(timeout),
      redirect: "follow",
    });
  } catch {
    return null;
  }
}

async function safeFetchText(url: string, timeout = 8000): Promise<string | null> {
  const res = await safeFetch(url, timeout);
  if (!res || !res.ok) return null;
  try {
    return await res.text();
  } catch {
    return null;
  }
}

async function safeFetchJSON(url: string, timeout = 8000): Promise<unknown | null> {
  const res = await safeFetch(url, timeout);
  if (!res || !res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// ── Platform detection ──────────────────────────────────────────

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

// ── Technology detection ────────────────────────────────────────

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
  if (lower.includes("clarity.ms")) techs.push("Microsoft Clarity");
  if (lower.includes("pinterest")) techs.push("Pinterest Tag");
  if (lower.includes("tiktok") || lower.includes("analytics.tiktok")) techs.push("TikTok Pixel");
  if (lower.includes("google.com/recaptcha") || lower.includes("recaptcha")) techs.push("reCAPTCHA");
  if (lower.includes("cloudflare")) techs.push("Cloudflare");
  if (lower.includes("jquery")) techs.push("jQuery");
  if (lower.includes("bootstrap")) techs.push("Bootstrap");
  if (lower.includes("react")) techs.push("React");
  if (lower.includes("onesignal")) techs.push("OneSignal");
  if (lower.includes("klaviyo")) techs.push("Klaviyo");
  if (lower.includes("tidio")) techs.push("Tidio");
  if (lower.includes("jivochat") || lower.includes("jivosite")) techs.push("JivoChat");
  if (lower.includes("google.com/maps") || lower.includes("maps.googleapis")) techs.push("Google Maps");

  return techs;
}

// ── Blog detection ──────────────────────────────────────────────

function detectBlogFromHTML($: cheerio.CheerioAPI, html: string): boolean {
  // Check nav links and anchor tags for blog paths
  const blogPatterns = ["/blog", "/noticias", "/artigos", "/news", "/posts", "/journal"];
  const allLinks = $("a[href]")
    .map((_, el) => $(el).attr("href") || "")
    .get();

  for (const link of allLinks) {
    const lower = link.toLowerCase();
    if (blogPatterns.some((p) => lower.includes(p))) return true;
  }

  // Check for blog-related meta or structured data
  const lower = html.toLowerCase();
  if (lower.includes('"@type":"blog"') || lower.includes('"@type": "blog"')) return true;
  if (lower.includes('"@type":"blogposting"') || lower.includes('"@type": "blogposting"')) return true;

  return false;
}

async function checkBlogExists(baseUrl: string): Promise<boolean> {
  const blogPaths = ["/blog", "/noticias"];
  for (const path of blogPaths) {
    const res = await safeFetch(`${baseUrl}${path}`, 5000);
    if (res && res.ok) return true;
  }
  return false;
}

// ── Category extraction from HTML ───────────────────────────────

function extractCategoriesFromHTML($: cheerio.CheerioAPI): number {
  const categoryLinks = new Set<string>();

  // Common selectors for navigation menus with category links
  const navSelectors = [
    "nav a[href]",
    ".menu a[href]",
    ".nav a[href]",
    ".navbar a[href]",
    ".navigation a[href]",
    "#menu a[href]",
    ".header a[href]",
    '[class*="menu"] a[href]',
    '[class*="nav"] a[href]',
    '[class*="category"] a[href]',
    '[class*="categoria"] a[href]',
  ];

  const excludePatterns = [
    /^\/?$/,
    /^#/,
    /\/(cart|carrinho|checkout|login|conta|account|contato|contact|sobre|about|faq|politica|privacy|terms|termos|blog|noticias)\b/i,
    /^https?:\/\/(?!)/,
    /^mailto:/,
    /^tel:/,
    /\.(jpg|png|gif|svg|css|js)$/i,
  ];

  for (const selector of navSelectors) {
    $(selector).each((_, el) => {
      const href = $(el).attr("href") || "";
      if (!href) return;

      // Skip non-category links
      if (excludePatterns.some((p) => p.test(href))) return;

      // Look for links that look like category/collection pages
      const categoryPatterns = [
        /\/collections?\//i,
        /\/categor(y|ia|ias|ies)\//i,
        /\/department/i,
        /\/loja\//i,
        /\/produtos?\//i,
        /\/products?\//i,
      ];

      if (categoryPatterns.some((p) => p.test(href))) {
        categoryLinks.add(href.split("?")[0].split("#")[0]);
      }
    });
  }

  return categoryLinks.size;
}

// ── Sitemap parsing ─────────────────────────────────────────────

interface SitemapCounts {
  products: number;
  categories: number;
  blogPosts: number;
}

async function parseSitemap(baseUrl: string): Promise<SitemapCounts> {
  const counts: SitemapCounts = { products: 0, categories: 0, blogPosts: 0 };

  // Try main sitemap
  const sitemapXml = await safeFetchText(`${baseUrl}/sitemap.xml`, 8000);
  if (!sitemapXml) return counts;

  const $ = cheerio.load(sitemapXml, { xml: true });

  // Check if it's a sitemap index (has <sitemap> tags pointing to sub-sitemaps)
  const subSitemaps = $("sitemap loc")
    .map((_, el) => $(el).text())
    .get();

  if (subSitemaps.length > 0) {
    // Parse sub-sitemaps in parallel (limit to first 5 to avoid slowness)
    const subResults = await Promise.all(
      subSitemaps.slice(0, 5).map(async (subUrl) => {
        const subXml = await safeFetchText(subUrl, 6000);
        if (!subXml) return { products: 0, categories: 0, blogPosts: 0 };
        return countUrlsInSitemap(subUrl, subXml);
      }),
    );
    for (const r of subResults) {
      counts.products += r.products;
      counts.categories += r.categories;
      counts.blogPosts += r.blogPosts;
    }
  } else {
    // Single sitemap — count URLs directly
    const result = countUrlsInSitemap(`${baseUrl}/sitemap.xml`, sitemapXml);
    counts.products = result.products;
    counts.categories = result.categories;
    counts.blogPosts = result.blogPosts;
  }

  return counts;
}

function countUrlsInSitemap(sitemapUrl: string, xml: string): SitemapCounts {
  const counts: SitemapCounts = { products: 0, categories: 0, blogPosts: 0 };
  const $ = cheerio.load(xml, { xml: true });
  const lowerSitemapUrl = sitemapUrl.toLowerCase();

  // If the sitemap URL itself indicates its type, count all <url> entries
  if (lowerSitemapUrl.includes("product")) {
    counts.products = $("url").length;
    return counts;
  }
  if (lowerSitemapUrl.includes("collection") || lowerSitemapUrl.includes("categor")) {
    counts.categories = $("url").length;
    return counts;
  }
  if (lowerSitemapUrl.includes("blog") || lowerSitemapUrl.includes("post") || lowerSitemapUrl.includes("noticias")) {
    counts.blogPosts = $("url").length;
    return counts;
  }

  // Otherwise, classify each URL by path
  $("url loc").each((_, el) => {
    const loc = $(el).text().toLowerCase();
    if (/\/products?\//.test(loc) || /\/produto/.test(loc)) {
      counts.products++;
    } else if (/\/collections?\//.test(loc) || /\/categor/.test(loc) || /\/department/.test(loc)) {
      counts.categories++;
    } else if (/\/blog\//.test(loc) || /\/noticias\//.test(loc) || /\/posts?\//.test(loc)) {
      counts.blogPosts++;
    }
  });

  return counts;
}

// ── Platform-specific data fetchers ─────────────────────────────

interface PlatformStoreData {
  productCount: number | null;
  categoryCount: number | null;
  hasBlog: boolean | null;
}

async function fetchShopifyData(baseUrl: string): Promise<PlatformStoreData> {
  const result: PlatformStoreData = { productCount: null, categoryCount: null, hasBlog: null };

  // Shopify exposes /products.json and /collections.json
  const [productsData, collectionsData, blogsData] = await Promise.all([
    safeFetchJSON(`${baseUrl}/products.json?limit=1`, 6000),
    safeFetchJSON(`${baseUrl}/collections.json`, 6000),
    safeFetchJSON(`${baseUrl}/blogs.json`, 6000),
  ]);

  // products.json doesn't give total count directly, try /products/count.json or use collections
  if (productsData && typeof productsData === "object") {
    // Try the count endpoint
    const countData = (await safeFetchJSON(`${baseUrl}/products/count.json`, 5000)) as Record<string, unknown> | null;
    if (countData && typeof countData.count === "number") {
      result.productCount = countData.count;
    }
  }

  if (collectionsData && typeof collectionsData === "object") {
    const cols = (collectionsData as Record<string, unknown>).collections;
    if (Array.isArray(cols)) {
      result.categoryCount = cols.length;
    }
  }

  if (blogsData && typeof blogsData === "object") {
    const blogs = (blogsData as Record<string, unknown>).blogs;
    result.hasBlog = Array.isArray(blogs) && blogs.length > 0;
  }

  return result;
}

async function fetchWooCommerceData(baseUrl: string): Promise<PlatformStoreData> {
  const result: PlatformStoreData = { productCount: null, categoryCount: null, hasBlog: null };

  // WooCommerce Store API (public, no auth needed)
  const [productsRes, categoriesRes] = await Promise.all([
    safeFetch(`${baseUrl}/wp-json/wc/store/v1/products?per_page=1`, 6000),
    safeFetchJSON(`${baseUrl}/wp-json/wc/store/v1/products/categories?per_page=100`, 6000),
  ]);

  // Product count from X-WP-Total header
  if (productsRes && productsRes.ok) {
    const total = productsRes.headers.get("X-WP-Total");
    if (total) result.productCount = parseInt(total, 10);
  }

  if (categoriesRes && Array.isArray(categoriesRes)) {
    result.categoryCount = categoriesRes.length;
  }

  // WP always has blog capability — check if there are posts
  const postsRes = await safeFetch(`${baseUrl}/wp-json/wp/v2/posts?per_page=1`, 5000);
  if (postsRes && postsRes.ok) {
    const totalPosts = postsRes.headers.get("X-WP-Total");
    result.hasBlog = totalPosts ? parseInt(totalPosts, 10) > 0 : false;
  }

  return result;
}

async function fetchNuvemshopData(baseUrl: string): Promise<PlatformStoreData> {
  const result: PlatformStoreData = { productCount: null, categoryCount: null, hasBlog: null };

  // Nuvemshop/Tiendanube exposes category listing pages
  // Try sitemap which is well-structured on Nuvemshop
  const sitemapCounts = await parseSitemap(baseUrl);
  if (sitemapCounts.products > 0) result.productCount = sitemapCounts.products;
  if (sitemapCounts.categories > 0) result.categoryCount = sitemapCounts.categories;
  if (sitemapCounts.blogPosts > 0) result.hasBlog = true;

  return result;
}

async function fetchVtexData(baseUrl: string): Promise<PlatformStoreData> {
  const result: PlatformStoreData = { productCount: null, categoryCount: null, hasBlog: null };

  // VTEX search API (public)
  const searchRes = await safeFetch(`${baseUrl}/api/catalog_system/pub/products/search?_from=0&_to=0`, 6000);
  if (searchRes && searchRes.ok) {
    const totalResources = searchRes.headers.get("resources");
    if (totalResources) {
      // Format: "0-0/TOTAL"
      const match = totalResources.match(/\/(\d+)/);
      if (match) result.productCount = parseInt(match[1], 10);
    }
  }

  // VTEX category tree (public)
  const categories = (await safeFetchJSON(`${baseUrl}/api/catalog_system/pub/category/tree/3`, 6000)) as
    | unknown[]
    | null;
  if (Array.isArray(categories)) {
    result.categoryCount = categories.length;
  }

  return result;
}

// ── Main scraping orchestrator ──────────────────────────────────

async function scrapeStore(url: string): Promise<ScrapedData> {
  const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
  const baseUrl = normalizedUrl.replace(/\/+$/, "");

  const emptyResult: ScrapedData = {
    title: "",
    description: "",
    detectedPlatform: null,
    productCount: null,
    categoryCount: null,
    hasBlog: null,
    integrationCount: null,
    hasSSL: baseUrl.startsWith("https"),
    technologies: [],
  };

  // Step 1: Fetch homepage HTML
  const html = await safeFetchText(baseUrl, 10000);
  if (!html) return emptyResult;

  const $ = cheerio.load(html);

  const title = $("title").first().text().trim() || $('meta[property="og:title"]').attr("content") || "";
  const description =
    $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || "";

  const detectedPlatform = detectPlatform(html);
  const technologies = detectTechnologies(html);

  // Step 2: Extract LD+JSON product data as initial fallback
  let ldProductCount: number | null = null;
  const ldJsonScripts = $('script[type="application/ld+json"]');
  ldJsonScripts.each((_, el) => {
    try {
      const data = JSON.parse($(el).text());
      if (data["@type"] === "ItemList" && data.numberOfItems) {
        ldProductCount = data.numberOfItems;
      }
      if (data["@type"] === "ItemList" && Array.isArray(data.itemListElement)) {
        ldProductCount = data.itemListElement.length;
      }
    } catch {
      // ignore
    }
  });

  // Step 3: Detect blog from HTML
  const blogInHTML = detectBlogFromHTML($, html);

  // Step 4: Extract categories from navigation
  const navCategories = extractCategoriesFromHTML($);

  // Step 5: Platform-specific data fetching (runs in parallel with sitemap)
  let platformData: PlatformStoreData = { productCount: null, categoryCount: null, hasBlog: null };

  const [platformResult, sitemapCounts, blogExists] = await Promise.all([
    // Platform-specific APIs
    (async (): Promise<PlatformStoreData> => {
      switch (detectedPlatform) {
        case "shopify":
          return fetchShopifyData(baseUrl);
        case "woocommerce":
          return fetchWooCommerceData(baseUrl);
        case "nuvemshop":
          return fetchNuvemshopData(baseUrl);
        case "vtex":
          return fetchVtexData(baseUrl);
        default:
          return { productCount: null, categoryCount: null, hasBlog: null };
      }
    })(),
    // Generic sitemap parsing (for platforms without specific APIs, or as supplement)
    detectedPlatform !== "nuvemshop" ? parseSitemap(baseUrl) : Promise.resolve({ products: 0, categories: 0, blogPosts: 0 }),
    // Direct blog URL check
    !blogInHTML ? checkBlogExists(baseUrl) : Promise.resolve(true),
  ]);

  platformData = platformResult;

  // Step 6: Merge all data sources (prefer platform API > sitemap > LD+JSON > HTML nav)
  const productCount = platformData.productCount
    ?? (sitemapCounts.products > 0 ? sitemapCounts.products : null)
    ?? ldProductCount;

  const categoryCount = platformData.categoryCount
    ?? (sitemapCounts.categories > 0 ? sitemapCounts.categories : null)
    ?? (navCategories > 0 ? navCategories : null);

  const hasBlog = platformData.hasBlog
    ?? (sitemapCounts.blogPosts > 0 ? true : null)
    ?? (blogInHTML || blogExists || null);

  return {
    title,
    description,
    detectedPlatform,
    productCount,
    categoryCount,
    hasBlog,
    integrationCount: technologies.length > 0 ? technologies.length : null,
    hasSSL: baseUrl.startsWith("https"),
    technologies,
  };
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
