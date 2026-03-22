"use client";

import { motion } from "framer-motion";
import type { AnalysisResult } from "@/types/report";
import { PLATFORM_NAMES } from "@/lib/data";
import { formatBRL } from "@/lib/analyze";

interface EconomyReportProps {
  result: AnalysisResult;
}

export function EconomyReport({ result }: EconomyReportProps) {
  const { costs, platform } = result;
  const bd = costs.current.breakdown;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-[1000px] px-4 py-10 sm:px-0 sm:py-16"
    >
      <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-light px-3 py-1.5 text-[11px] font-bold tracking-wide text-accent uppercase sm:mb-5 sm:px-3.5 sm:text-xs">
        Economia Projetada
      </span>
      <h2 className="mb-2 text-[22px] font-extrabold tracking-tight text-primary sm:mb-3 sm:text-[28px] md:text-[32px]">
        Sua economia migrando para a Nuvemshop
      </h2>
      <p className="mb-8 max-w-[600px] text-[14px] leading-relaxed text-neutral-500 sm:mb-10 sm:text-base">
        Com base nos dados da sua loja, calculamos a economia projetada ao
        migrar para a Nuvemshop Next.
      </p>

      {/* AI Insight */}
      {result.aiInsight && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 rounded-xl border border-accent/20 bg-accent-light/50 p-5 sm:mb-10 sm:p-6"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                <line x1="9" y1="21" x2="15" y2="21" />
              </svg>
            </span>
            <span className="text-[12px] font-bold tracking-wide text-accent uppercase sm:text-[13px]">
              Diagnóstico por IA
            </span>
            <span className={`ml-auto rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              result.aiInsight.migrationComplexity === "baixa"
                ? "bg-success/10 text-success"
                : result.aiInsight.migrationComplexity === "média"
                ? "bg-warning/10 text-warning"
                : "bg-danger/10 text-danger"
            }`}>
              Complexidade {result.aiInsight.migrationComplexity}
            </span>
          </div>
          <p className="mb-4 text-[13px] leading-relaxed text-primary/80 sm:text-[14px]">
            {result.aiInsight.summary}
          </p>
          {result.aiInsight.personalizedTips.length > 0 && (
            <ul className="flex flex-col gap-2">
              {result.aiInsight.personalizedTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-primary/70 sm:text-[13px]">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-[10px] font-bold text-success">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          )}
          {result.scraped && result.scraped.technologies.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-accent/10 pt-3">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase">Tecnologias detectadas:</span>
              {result.scraped.technologies.map((tech) => (
                <span key={tech} className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-primary/70 shadow-sm">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Comparison */}
      <div className="mb-6 grid items-stretch gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-[1fr_auto_1fr]">
        {/* Current */}
        <div className="rounded-xl border border-border bg-neutral-100 p-5 sm:p-6 md:p-7">
          <p className="mb-1 text-[12px] font-semibold tracking-wide text-neutral-500 uppercase sm:text-[13px]">
            Plataforma atual
          </p>
          <p className="mb-3 text-base font-bold text-primary sm:mb-4 sm:text-lg">
            {PLATFORM_NAMES[platform]}
          </p>
          <p className="mb-1 text-3xl font-extrabold tracking-tight text-danger sm:text-4xl">
            R$ {formatBRL(costs.current.total)}
          </p>
          <p className="mb-4 text-[13px] text-neutral-500 sm:mb-5 sm:text-sm">por mês (estimado)</p>
          <div className="flex flex-col gap-2 border-t border-border pt-3 sm:gap-2.5 sm:pt-4">
            <div className="flex justify-between text-[13px] sm:text-sm">
              <span className="text-neutral-500">Plano mensal</span>
              <span className="font-semibold text-primary">
                {bd.planLabel}
              </span>
            </div>
            <div className="flex justify-between text-[13px] sm:text-sm">
              <span className="text-neutral-500">
                Taxas ({bd.txLabel})
              </span>
              <span className="font-semibold text-primary">
                R$ {formatBRL(costs.current.txCost)}
              </span>
            </div>
            <div className="flex justify-between text-[13px] sm:text-sm">
              <span className="text-neutral-500">Apps/plugins pagos</span>
              <span className="font-semibold text-primary">
                {bd.appsLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center text-accent max-lg:rotate-90">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>

        {/* Nuvemshop */}
        <div className="relative rounded-xl border-2 border-accent bg-accent-light p-5 sm:p-6 md:p-7">
          <span className="absolute -top-3 right-4 rounded-full bg-accent px-3 py-1 text-[11px] font-bold tracking-wide text-white sm:text-xs">
            Recomendado
          </span>
          <p className="mb-1 text-[12px] font-semibold tracking-wide text-neutral-500 uppercase sm:text-[13px]">
            Nuvemshop
          </p>
          <p className="mb-3 text-base font-bold text-primary sm:mb-4 sm:text-lg">Nuvemshop</p>
          <p className="mb-1 text-3xl font-extrabold tracking-tight text-success sm:text-4xl">
            R$ {formatBRL(costs.nuvemshop.total)}
          </p>
          <p className="mb-4 text-[13px] text-neutral-500 sm:mb-5 sm:text-sm">por mês</p>
          <div className="flex flex-col gap-2 border-t border-accent/15 pt-3 sm:gap-2.5 sm:pt-4">
            <div className="flex justify-between text-[13px] sm:text-sm">
              <span className="text-neutral-500">Plano Next</span>
              <span className="font-semibold text-primary">
                R$ {formatBRL(costs.nuvemshop.total)}
              </span>
            </div>
            <div className="flex justify-between text-[13px] sm:text-sm">
              <span className="text-neutral-500">Taxas de transação</span>
              <span className="font-semibold text-success">
                R$ 0 (Nuvem Pago)
              </span>
            </div>
            <div className="flex justify-between text-[13px] sm:text-sm">
              <span className="text-neutral-500">Apps/funcionalidades</span>
              <span className="font-semibold text-success">Incluído</span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings highlight */}
      <div className="relative overflow-hidden rounded-xl border-2 border-success bg-success-light px-5 py-5 text-center sm:px-8 sm:py-6">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(0,166,80,0.08),transparent)]" />
        <p className="mb-1 text-[12px] font-semibold tracking-wide text-success uppercase sm:mb-1.5 sm:text-sm">
          Economia anual estimada
        </p>
        <p className="text-[32px] font-extrabold leading-tight tracking-tight text-success sm:text-[40px]">
          R$ {formatBRL(costs.annualSavings)}
        </p>
        <p className="mt-1 text-[13px] text-success/70 sm:text-[15px]">
          por ano migrando para a Nuvemshop Next
        </p>
      </div>
      <p className="mt-4 text-center text-[11px] text-neutral-500 italic sm:mt-6 sm:text-xs">
        * Estimativa baseada em dados públicos e informações declaradas. Valores
        reais podem variar.
      </p>
    </motion.section>
  );
}
