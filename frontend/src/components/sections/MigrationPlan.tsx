"use client";

import { motion } from "framer-motion";
import type { AnalysisResult } from "@/types/report";

interface MigrationPlanProps {
  result: AnalysisResult;
}

export function MigrationPlan({ result }: MigrationPlanProps) {
  const { store, timeline, totalDays } = result;

  const stats = [
    { value: String(store.products), label: "Produtos" },
    { value: String(store.categories), label: "Categorias" },
    { value: store.hasBlog ? "Sim" : "Não", label: "Blog ativo" },
    { value: String(store.integrations), label: "Integrações" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mx-auto max-w-[1000px] px-4 py-10 sm:px-0 sm:py-16"
    >
      <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-light px-3 py-1.5 text-[11px] font-bold tracking-wide text-accent uppercase sm:mb-5 sm:px-3.5 sm:text-xs">
        Seu Plano de Migração
      </span>
      <h2 className="mb-2 text-[22px] font-extrabold tracking-tight text-primary sm:mb-3 sm:text-[28px] md:text-[32px]">
        O que detectamos na sua loja
      </h2>
      <p className="mb-8 max-w-[600px] text-[14px] leading-relaxed text-neutral-500 sm:mb-10 sm:text-base">
        Analisamos a estrutura da sua loja para criar um plano de migração
        personalizado.
      </p>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:mb-10 sm:grid-cols-4 sm:gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-lg border border-transparent bg-surface-alt p-4 text-center transition-all hover:border-accent hover:shadow-sm sm:p-5"
          >
            <p className="mb-0.5 text-[24px] font-extrabold leading-tight text-accent sm:mb-1 sm:text-[28px]">
              {s.value}
            </p>
            <p className="text-[12px] font-medium text-neutral-500 sm:text-[13px]">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Timeline header */}
      <p className="mb-5 flex flex-col gap-1 text-base font-bold text-primary sm:mb-6 sm:flex-row sm:items-center sm:gap-2 sm:text-lg">
        Cronograma estimado:
        <span className="text-[14px] font-medium text-neutral-500 sm:text-[15px]">
          ~{totalDays} dias com migração assistida
        </span>
      </p>

      {/* Timeline */}
      <div className="relative pl-10 sm:pl-11">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-[18px] bottom-[18px] w-0.5 bg-border sm:left-[17px]" />

        <div className="flex flex-col">
          {timeline.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative flex items-start gap-3 py-2.5 sm:gap-4 sm:py-3"
            >
              <div className="absolute -left-10 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[13px] font-bold text-white shadow-[0_2px_8px_rgba(0,80,195,0.2)] sm:-left-11 sm:h-9 sm:w-9 sm:text-sm">
                {i + 1}
              </div>
              <div className="pt-0.5 sm:pt-1">
                <p className="text-[14px] font-semibold text-primary sm:text-base">
                  {step.title}
                </p>
                <p className="mt-0.5 text-[13px] text-neutral-500 sm:text-sm">
                  {step.duration} — {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-6 rounded-lg border-l-4 border-accent bg-surface-alt px-4 py-4 text-[14px] leading-relaxed text-primary italic sm:mt-8 sm:px-6 sm:py-5 sm:text-[15px]"
      >
        Lojas com complexidade similar à sua migraram em aproximadamente{" "}
        {totalDays} dias com migração assistida pela equipe da Nuvemshop Next.
      </motion.div>
    </motion.section>
  );
}
