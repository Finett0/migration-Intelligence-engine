"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Platform, RevenueRange, Pain } from "@/types/report";
import { REVENUE_LABELS, PAIN_OPTIONS } from "@/lib/data";

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "shopify", label: "Shopify" },
  { value: "tray", label: "Tray" },
  { value: "woocommerce", label: "WooCommerce" },
  { value: "loja-integrada", label: "Loja Integrada" },
  { value: "outra", label: "Outra" },
];

interface QualificationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (platform: Platform, revenue: RevenueRange, pains: Pain[]) => void;
}

export function QualificationForm({
  open,
  onClose,
  onSubmit,
}: QualificationFormProps) {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [revenue, setRevenue] = useState<RevenueRange | null>(null);
  const [pains, setPains] = useState<Set<Pain>>(new Set());

  const togglePain = useCallback((pain: Pain) => {
    setPains((prev) => {
      const next = new Set(prev);
      if (next.has(pain)) next.delete(pain);
      else next.add(pain);
      return next;
    });
  }, []);

  const isReady = platform && revenue;

  function handleGenerate() {
    if (!platform || !revenue) return;
    onSubmit(platform, revenue, Array.from(pains));
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-primary/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:max-w-[560px] sm:rounded-2xl sm:p-8 md:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-md bg-neutral-100 text-neutral-500 transition-colors hover:bg-border hover:text-primary sm:right-4 sm:top-4"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h2 className="mb-2 text-xl font-extrabold tracking-tight text-primary sm:text-2xl">
              Conte-nos sobre sua loja
            </h2>
            <p className="mb-6 text-[14px] leading-relaxed text-neutral-500 sm:mb-7 sm:text-[15px]">
              Essas informações nos ajudam a gerar um relatório mais preciso
              para você.
            </p>

            {/* Platform */}
            <div className="mb-5 sm:mb-6">
              <label className="mb-2 block text-sm font-semibold text-primary sm:mb-2.5">
                Plataforma atual
              </label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPlatform(p.value)}
                    className={`cursor-pointer rounded-md border-2 px-3 py-2 text-[13px] font-semibold transition-all sm:px-4 sm:py-2.5 sm:text-sm ${
                      platform === p.value
                        ? "border-accent bg-accent text-white"
                        : "border-border bg-white text-neutral-500 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Revenue */}
            <div className="mb-5 sm:mb-6">
              <label className="mb-2 block text-sm font-semibold text-primary sm:mb-2.5">
                Faturamento mensal aproximado
              </label>
              <select
                value={revenue ?? ""}
                onChange={(e) => setRevenue(e.target.value as RevenueRange)}
                className="w-full cursor-pointer appearance-none rounded-md border border-border bg-white px-4 py-3 text-[15px] text-primary outline-none transition-colors focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,80,195,0.1)]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                }}
              >
                <option value="" disabled>
                  Selecione uma faixa
                </option>
                {(Object.entries(REVENUE_LABELS) as [RevenueRange, string][]).map(
                  ([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Pains */}
            <div className="mb-6 sm:mb-8">
              <label className="mb-2 block text-sm font-semibold text-primary sm:mb-2.5">
                Maiores frustrações com a plataforma atual
              </label>
              <div className="flex flex-wrap gap-2">
                {PAIN_OPTIONS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => togglePain(p.value as Pain)}
                    className={`cursor-pointer rounded-full border-[1.5px] px-3 py-1.5 text-[12px] font-medium transition-all select-none sm:px-4 sm:py-2 sm:text-[13px] ${
                      pains.has(p.value as Pain)
                        ? "border-accent bg-accent-light text-accent"
                        : "border-border bg-white text-neutral-500 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleGenerate}
              disabled={!isReady}
              className="h-12 w-full cursor-pointer rounded-md bg-accent text-[15px] font-bold text-white transition-all hover:bg-accent-hover hover:-translate-y-px hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:translate-y-0 sm:h-[52px] sm:text-base"
            >
              Gerar meu relatório
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
