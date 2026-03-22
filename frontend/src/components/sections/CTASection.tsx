"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { formatBRL } from "@/lib/analyze";

interface CTASectionProps {
  annualSavings: number;
}

export function CTASection({ annualSavings }: CTASectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !phone.trim()) return;
    setSubmitted(true);
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative mt-6 overflow-hidden bg-gradient-to-br from-primary to-accent px-4 py-14 text-center sm:mt-8 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.03),transparent)]" />

      <div className="relative z-10 mx-auto max-w-[640px]">
        <h2 className="mb-2 text-[22px] font-extrabold leading-tight text-white sm:mb-3 sm:text-[28px] md:text-4xl">
          Pronto para economizar R$ {formatBRL(annualSavings)}/ano?
        </h2>
        <p className="mb-8 text-[15px] leading-relaxed text-white/70 sm:mb-10 sm:text-lg">
          Agende uma demonstração gratuita com nosso time de especialistas em
          migração.
        </p>

        {!showForm ? (
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="w-full cursor-pointer rounded-md bg-white px-7 py-3.5 text-[15px] font-bold text-accent shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl sm:w-auto sm:px-9 sm:py-4 sm:text-[17px]"
            >
              Agendar demonstração
            </button>
            <button className="w-full cursor-pointer rounded-md border-2 border-white/40 bg-transparent px-7 py-3.5 text-[15px] font-bold text-white transition-all hover:border-white hover:bg-white/[.08] sm:w-auto sm:px-9 sm:py-4 sm:text-[17px]">
              Baixar relatório em PDF
            </button>
          </div>
        ) : !submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-5 flex items-center gap-4 text-[12px] font-medium text-white/35 sm:mb-6 sm:text-[13px]">
              <span className="h-px flex-1 bg-white/12" />
              Deixe seus dados para agendarmos
              <span className="h-px flex-1 bg-white/12" />
            </div>
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-[520px] flex-col gap-2.5 sm:flex-row"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                required
                className="min-w-0 flex-1 rounded-md border-[1.5px] border-white/20 bg-white/[.08] px-4 py-3 text-[14px] text-white outline-none backdrop-blur-sm transition-all placeholder:text-white/35 focus:border-white/50 focus:bg-white/12 sm:py-3.5 sm:text-[15px]"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="WhatsApp (com DDD)"
                required
                className="min-w-0 flex-1 rounded-md border-[1.5px] border-white/20 bg-white/[.08] px-4 py-3 text-[14px] text-white outline-none backdrop-blur-sm transition-all placeholder:text-white/35 focus:border-white/50 focus:bg-white/12 sm:py-3.5 sm:text-[15px]"
              />
              <button
                type="submit"
                className="cursor-pointer rounded-md bg-success px-7 py-3 text-[14px] font-bold whitespace-nowrap text-white transition-all hover:-translate-y-px hover:bg-[#009244] sm:py-3.5 sm:text-[15px]"
              >
                Enviar
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-[520px] rounded-lg border border-success/30 bg-success/15 px-5 py-4 text-[14px] font-medium text-white sm:px-6 sm:py-5 sm:text-[15px]"
          >
            Pronto! Nossa equipe entrará em contato em breve pelo WhatsApp.
            Fique de olho!
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
