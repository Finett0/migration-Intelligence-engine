"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onSubmitUrl: (url: string) => void;
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function HeroSection({ onSubmitUrl }: HeroSectionProps) {
  const [url, setUrl] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (url.trim()) onSubmitUrl(url.trim());
  }

  const trustItems = [
    "300+ migrações realizadas",
    "96% de satisfação",
    "Gratuito e instantâneo",
  ];

  return (
    <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-accent px-4 pt-24 pb-14 text-center sm:px-6 sm:pt-28 sm:pb-20 lg:px-8 lg:pt-32 lg:pb-24">
      {/* Background orbs */}
      <div className="pointer-events-none absolute -right-[20%] -top-[40%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,80,195,0.15),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-[30%] -left-[15%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,80,195,0.1),transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-[720px]"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[12px] font-semibold tracking-wide text-white/90 backdrop-blur-sm sm:mb-6 sm:px-4 sm:text-[13px]"
        >
          <span className="h-2 w-2 animate-[dot-pulse_2s_ease-in-out_infinite] rounded-full bg-success shadow-[0_0_8px_rgba(0,166,80,0.5)]" />
          Calcule o ROI da sua migração
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-4 text-[26px] font-extrabold leading-[1.15] tracking-tight text-white sm:mb-5 sm:text-[36px] md:text-[40px] lg:text-[48px]"
        >
          Descubra quanto você{" "}
          <span className="relative inline-block">
            economiza
            <span className="absolute bottom-0.5 left-0 right-0 h-1 rounded-full bg-success/60" />
          </span>{" "}
          migrando para a Nuvemshop
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mx-auto mb-8 max-w-[540px] text-[15px] leading-relaxed text-white/70 sm:mb-10 sm:text-base lg:text-lg"
        >
          Analise sua loja atual em 30 segundos e receba um relatório
          personalizado com economia projetada, plano de migração e benefícios
          exclusivos.
        </motion.p>

        {/* URL Input */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mx-auto mb-6 flex max-w-[560px] flex-col gap-2 sm:flex-row sm:gap-0 sm:overflow-hidden sm:rounded-md sm:shadow-xl sm:transition-shadow sm:focus-within:shadow-[0_16px_48px_rgba(23,30,67,0.16),0_0_0_3px_rgba(0,80,195,0.2)]"
        >
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://minhaloja.com.br"
            required
            className="min-w-0 flex-1 rounded-lg bg-white px-4 py-3.5 text-[15px] text-primary shadow-lg outline-none placeholder:text-neutral-300 sm:rounded-none sm:px-5 sm:py-4 sm:text-[17px] sm:shadow-none"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-accent px-6 py-3.5 text-[15px] font-bold whitespace-nowrap text-white shadow-lg transition-colors hover:bg-accent-hover sm:rounded-none sm:px-8 sm:py-4 sm:text-base sm:shadow-none"
          >
            Analisar minha loja
          </button>
        </motion.form>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-6"
        >
          {trustItems.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1.5 text-[13px] font-medium text-white/50 sm:text-sm"
            >
              <CheckIcon />
              {item}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
