import jsPDF from "jspdf";
import type { AnalysisResult } from "@/types/report";
import { PLATFORM_NAMES } from "./data";
import { formatBRL } from "./analyze";

// ── Colors ──────────────────────────────────────────────────────
const PRIMARY: [number, number, number] = [23, 30, 67]; // #171E43
const ACCENT: [number, number, number] = [0, 80, 195]; // #0050C3
const SUCCESS: [number, number, number] = [0, 166, 80]; // #00A650
const DANGER: [number, number, number] = [229, 57, 53]; // #E53935
const GRAY: [number, number, number] = [107, 114, 128];
const LIGHT_BG: [number, number, number] = [245, 247, 250];
const WHITE: [number, number, number] = [255, 255, 255];

// Map emoji icons to safe text labels for PDF (Helvetica can't render emojis)
const ICON_LABELS: Record<string, string> = {
  "\uD83D\uDCB3": "[$]", // 💳
  "\uD83D\uDE9A": "[>]", // 🚚
  "\uD83C\uDDE7\uD83C\uDDF7": "[BR]", // 🇧🇷
  "\uD83C\uDFA8": "[#]", // 🎨
  "\uD83D\uDCB0": "[$]", // 💰
  "\uD83E\uDD16": "[AI]", // 🤖
  "\u26A1": "[!]", // ⚡
  "\uD83D\uDED2": "[~]", // 🛒
  "\uD83E\uDDE9": "[+]", // 🧩
  "\uD83D\uDD27": "[*]", // 🔧
  "\uD83D\uDD12": "[S]", // 🔒
  "\uD83D\uDCCA": "[=]", // 📊
  "\u267E\uFE0F": "[8]", // ♾️
  "\uD83D\uDC54": "[N]", // 👔
  "\uD83D\uDE80": "[>]", // 🚀
};

function safeIcon(emoji: string): string {
  return ICON_LABELS[emoji] || "[-]";
}

// ── Helpers ─────────────────────────────────────────────────────

function drawRoundedRect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  style: "F" | "S" | "FD" = "F",
) {
  doc.roundedRect(x, y, w, h, r, r, style);
}

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  for (const line of lines) {
    doc.text(line, x, y);
    y += lineHeight;
  }
  return y;
}

const PAGE_H = 297;
const FOOTER_H = 10;
const SAFE_BOTTOM = PAGE_H - FOOTER_H - 8; // 279mm

function checkPageBreak(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > SAFE_BOTTOM) {
    doc.addPage();
    return 20;
  }
  return y;
}

// ── Main PDF generator ──────────────────────────────────────────

export function generateReportPDF(result: AnalysisResult): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const marginX = 18;
  const contentW = pageW - marginX * 2;
  let y = 0;

  // ─── Header bar ───────────────────────────────────────────────
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pageW, 38, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...WHITE);
  doc.text("NuvemShop", marginX, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("Relatorio personalizado de migracao para Nuvemshop Next", marginX, 24);

  // Store URL + date
  doc.setFontSize(8);
  doc.setTextColor(200, 210, 255);
  const dateStr = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  doc.text(`${result.url}  |  ${dateStr}`, marginX, 32);

  y = 48;

  // ─── Economy section ──────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...ACCENT);
  doc.text("Economia Projetada", marginX, y);
  y += 8;

  const bd = result.costs.current.breakdown;
  const colW = (contentW - 6) / 2;

  // Current platform box
  doc.setFillColor(...LIGHT_BG);
  drawRoundedRect(doc, marginX, y, colW, 52, 3, "F");
  doc.setDrawColor(220, 220, 220);
  drawRoundedRect(doc, marginX, y, colW, 52, 3, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text("PLATAFORMA ATUAL", marginX + 5, y + 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...PRIMARY);
  doc.text(PLATFORM_NAMES[result.platform], marginX + 5, y + 14);

  doc.setFontSize(18);
  doc.setTextColor(...DANGER);
  doc.text(`R$ ${formatBRL(result.costs.current.total)}/mes`, marginX + 5, y + 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text(`Plano: ${bd.planLabel}`, marginX + 5, y + 32);
  doc.text(`Taxas (${bd.txLabel}): R$ ${formatBRL(result.costs.current.txCost)}`, marginX + 5, y + 38);
  doc.text(`Apps/plugins: ${bd.appsLabel}`, marginX + 5, y + 44);

  // Nuvemshop box
  const nuvX = marginX + colW + 6;
  doc.setFillColor(232, 240, 254);
  drawRoundedRect(doc, nuvX, y, colW, 52, 3, "F");
  doc.setDrawColor(...ACCENT);
  drawRoundedRect(doc, nuvX, y, colW, 52, 3, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text("NUVEMSHOP NEXT", nuvX + 5, y + 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...PRIMARY);
  doc.text("Nuvemshop", nuvX + 5, y + 14);

  doc.setFontSize(18);
  doc.setTextColor(...SUCCESS);
  doc.text(`R$ ${formatBRL(result.costs.nuvemshop.total)}/mes`, nuvX + 5, y + 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text(`Plano Next: R$ ${formatBRL(result.costs.nuvemshop.total)}`, nuvX + 5, y + 32);
  doc.text("Taxas de transacao: R$ 0 (Nuvem Pago)", nuvX + 5, y + 38);
  doc.text("Apps/funcionalidades: Incluido", nuvX + 5, y + 44);

  y += 58;

  // Annual savings highlight
  doc.setFillColor(236, 253, 243);
  drawRoundedRect(doc, marginX, y, contentW, 20, 3, "F");
  doc.setDrawColor(...SUCCESS);
  drawRoundedRect(doc, marginX, y, contentW, 20, 3, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...SUCCESS);
  doc.text("ECONOMIA ANUAL ESTIMADA", pageW / 2, y + 7, { align: "center" });
  doc.setFontSize(16);
  doc.text(`R$ ${formatBRL(result.costs.annualSavings)}`, pageW / 2, y + 16, { align: "center" });

  y += 28;

  // ─── AI Insight ───────────────────────────────────────────────
  if (result.aiInsight) {
    y = checkPageBreak(doc, y, 50);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...ACCENT);
    doc.text("Diagnostico por IA", marginX, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const summaryLines = doc.splitTextToSize(result.aiInsight.summary, contentW - 12);
    const tipsCount = result.aiInsight.personalizedTips.length;

    // Pre-calculate tips height
    let tipsH = 0;
    const tipLineArrays: string[][] = [];
    if (tipsCount > 0) {
      tipsH = 6;
      for (let i = 0; i < tipsCount; i++) {
        const lines = doc.splitTextToSize(result.aiInsight.personalizedTips[i], contentW - 20);
        tipLineArrays.push(lines);
        tipsH += lines.length * 4 + 3;
      }
    }

    const boxH = 10 + summaryLines.length * 4.5 + tipsH;

    // Check if the whole box fits, otherwise page break
    y = checkPageBreak(doc, y, boxH + 2);

    doc.setFillColor(232, 240, 254);
    drawRoundedRect(doc, marginX, y, contentW, boxH, 3, "F");

    // Complexity badge
    const complexity = result.aiInsight.migrationComplexity;
    const badgeColor: [number, number, number] =
      complexity === "baixa" ? SUCCESS : complexity === "média" ? [245, 158, 11] : DANGER;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...badgeColor);
    doc.text(`Complexidade: ${complexity}`, marginX + contentW - 6, y + 6, { align: "right" });

    const boxTop = y;
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...PRIMARY);
    y = addWrappedText(doc, result.aiInsight.summary, marginX + 6, y, contentW - 12, 4.5);

    if (tipsCount > 0) {
      y += 3;
      for (let i = 0; i < tipsCount; i++) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...SUCCESS);
        doc.text(`${i + 1}.`, marginX + 6, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...PRIMARY);
        const tipLines = tipLineArrays[i];
        for (let l = 0; l < tipLines.length; l++) {
          doc.text(tipLines[l], marginX + 12, y);
          y += 4;
        }
        y += 3;
      }
    }

    y = boxTop + boxH + 8;
  }

  // ─── Store stats ──────────────────────────────────────────────
  y = checkPageBreak(doc, y, 36);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...ACCENT);
  doc.text("O que detectamos na sua loja", marginX, y);
  y += 8;

  const stats = [
    { label: "Produtos", value: String(result.store.products) },
    { label: "Categorias", value: String(result.store.categories) },
    { label: "Blog ativo", value: result.store.hasBlog ? "Sim" : "Nao" },
    { label: "Integracoes", value: String(result.store.integrations) },
  ];

  const statW = (contentW - 9) / 4;
  stats.forEach((s, i) => {
    const sx = marginX + i * (statW + 3);
    doc.setFillColor(...LIGHT_BG);
    drawRoundedRect(doc, sx, y, statW, 20, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...ACCENT);
    doc.text(s.value, sx + statW / 2, y + 9, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...GRAY);
    doc.text(s.label, sx + statW / 2, y + 16, { align: "center" });
  });

  y += 28;

  // ─── Migration timeline ───────────────────────────────────────
  y = checkPageBreak(doc, y, 14 * result.timeline.length + 12);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...PRIMARY);
  doc.text(`Cronograma estimado: ~${result.totalDays} dias com migracao assistida`, marginX, y);
  y += 8;

  result.timeline.forEach((step, i) => {
    y = checkPageBreak(doc, y, 16);

    // Circle
    doc.setFillColor(...ACCENT);
    doc.circle(marginX + 4, y + 2.5, 3.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...WHITE);
    doc.text(String(i + 1), marginX + 4, y + 3.5, { align: "center" });

    // Line connecting to next
    if (i < result.timeline.length - 1) {
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(marginX + 4, y + 6, marginX + 4, y + 14);
    }

    // Text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...PRIMARY);
    doc.text(step.title, marginX + 12, y + 2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    const stepDesc = `${step.duration} -- ${step.description}`;
    doc.text(stepDesc, marginX + 12, y + 6.5);

    y += 14;
  });

  y += 6;

  // ─── Quick wins ───────────────────────────────────────────────
  y = checkPageBreak(doc, y, 30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...ACCENT);
  doc.text(`Beneficios ao migrar da ${PLATFORM_NAMES[result.platform]}`, marginX, y);
  y += 8;

  const qwColW = (contentW - 6) / 2;
  const ROW_H = 24;

  for (let i = 0; i < result.quickWins.length; i += 2) {
    y = checkPageBreak(doc, y, ROW_H + 4);

    // Left card
    const winL = result.quickWins[i];
    const qxL = marginX;
    doc.setFillColor(...LIGHT_BG);
    drawRoundedRect(doc, qxL, y, qwColW, ROW_H, 2, "F");
    doc.setDrawColor(230, 230, 230);
    drawRoundedRect(doc, qxL, y, qwColW, ROW_H, 2, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...ACCENT);
    doc.text(safeIcon(winL.icon), qxL + 4, y + 7);
    doc.setTextColor(...PRIMARY);
    doc.text(winL.title, qxL + 14, y + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY);
    const descLinesL = doc.splitTextToSize(winL.description, qwColW - 10);
    doc.text(descLinesL.slice(0, 2), qxL + 4, y + 13);

    // Right card (if exists)
    if (i + 1 < result.quickWins.length) {
      const winR = result.quickWins[i + 1];
      const qxR = marginX + qwColW + 6;
      doc.setFillColor(...LIGHT_BG);
      drawRoundedRect(doc, qxR, y, qwColW, ROW_H, 2, "F");
      doc.setDrawColor(230, 230, 230);
      drawRoundedRect(doc, qxR, y, qwColW, ROW_H, 2, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...ACCENT);
      doc.text(safeIcon(winR.icon), qxR + 4, y + 7);
      doc.setTextColor(...PRIMARY);
      doc.text(winR.title, qxR + 14, y + 7);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...GRAY);
      const descLinesR = doc.splitTextToSize(winR.description, qwColW - 10);
      doc.text(descLinesR.slice(0, 2), qxR + 4, y + 13);
    }

    y += ROW_H + 4;
  }

  // ─── Technologies detected ────────────────────────────────────
  if (result.scraped && result.scraped.technologies.length > 0) {
    y = checkPageBreak(doc, y, 12);
    y += 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...PRIMARY);
    doc.text("Tecnologias detectadas:", marginX, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    const techText = result.scraped.technologies.join(", ");
    const techLines = doc.splitTextToSize(techText, contentW - 40);
    doc.text(techLines, marginX + 38, y);
    y += techLines.length * 4 + 4;
  }

  // ─── Disclaimer ───────────────────────────────────────────────
  y = checkPageBreak(doc, y, 12);
  y += 4;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(...GRAY);
  doc.text(
    "* Estimativa baseada em dados publicos e informacoes declaradas. Valores reais podem variar.",
    pageW / 2,
    y,
    { align: "center" },
  );

  // ─── Footer on all pages ──────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFillColor(...PRIMARY);
    doc.rect(0, PAGE_H - FOOTER_H, pageW, FOOTER_H, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(200, 210, 255);
    doc.text("Nuvemshop Next  |  nuvemshop.com.br", marginX, PAGE_H - 4);
    doc.text(`Pagina ${p} de ${pageCount}`, pageW - marginX, PAGE_H - 4, { align: "right" });
  }

  // ─── Download ─────────────────────────────────────────────────
  const storeName = result.scraped?.title || result.url.replace(/https?:\/\//, "").replace(/\//g, "");
  const safeStoreName = storeName.replace(/[^a-zA-Z0-9-_]/g, "_").substring(0, 40);
  doc.save(`relatorio-migracao-${safeStoreName}.pdf`);
}
