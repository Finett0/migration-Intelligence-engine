"use client";

import { motion } from "framer-motion";
import type { AnalysisResult } from "@/types/report";
import { PLATFORM_NAMES } from "@/lib/data";

interface QuickWinsProps {
  result: AnalysisResult;
}

export function QuickWins({ result }: QuickWinsProps) {
  const { quickWins, platform } = result;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="mx-auto max-w-[1000px] px-4 py-10 sm:px-0 sm:py-16"
    >
      <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-success-light px-3 py-1.5 text-[11px] font-bold tracking-wide text-success uppercase sm:mb-5 sm:px-3.5 sm:text-xs">
        O que você ganha
      </span>
      <h2 className="mb-2 text-[22px] font-extrabold tracking-tight text-primary sm:mb-3 sm:text-[28px] md:text-[32px]">
        Benefícios exclusivos na Nuvemshop
      </h2>
      <p className="mb-8 max-w-[600px] text-[14px] leading-relaxed text-neutral-500 sm:mb-10 sm:text-base">
        Vantagens específicas para quem migra da {PLATFORM_NAMES[platform]} para
        a Nuvemshop Next.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {quickWins.map((win, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="rounded-xl border border-border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md sm:p-6"
          >
            <span className="mb-3 block text-[24px] sm:mb-3.5 sm:text-[28px]">{win.icon}</span>
            <p className="mb-1 text-[14px] font-bold leading-snug text-primary sm:mb-1.5 sm:text-base">
              {win.title}
            </p>
            <p className="text-[13px] leading-relaxed text-neutral-500 sm:text-sm">
              {win.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
