"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const STEPS = [
  "Analisando tecnologias da loja...",
  "Detectando plataforma e integrações...",
  "Calculando economia projetada...",
  "Consultando IA para diagnóstico personalizado...",
];

type StepState = "pending" | "active" | "done";

interface LoadingAnalysisProps {
  onComplete: () => void;
  analysisReady?: boolean;
}

function StepIcon({ state }: { state: StepState }) {
  if (state === "done") {
    return (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-white sm:h-7 sm:w-7">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sm:h-[14px] sm:w-[14px]"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  }
  if (state === "active") {
    return (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-light text-accent sm:h-7 sm:w-7">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-[spin_1s_linear_infinite] sm:h-[14px] sm:w-[14px]"
        >
          <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-300 sm:h-7 sm:w-7">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sm:h-[14px] sm:w-[14px]"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    </div>
  );
}

export function LoadingAnalysis({ onComplete, analysisReady = false }: LoadingAnalysisProps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    let step = 0;
    const timers: NodeJS.Timeout[] = [];

    function advance() {
      setCurrentStep(step);
      step++;
      if (step <= STEPS.length) {
        timers.push(setTimeout(advance, 1200 + Math.random() * 600));
      } else {
        setAnimationDone(true);
      }
    }

    timers.push(setTimeout(advance, 400));

    return () => timers.forEach(clearTimeout);
  }, []);

  // Only complete when both animation is done AND API result is ready
  useEffect(() => {
    if (animationDone && analysisReady) {
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }
  }, [animationDone, analysisReady, onComplete]);

  function getStepState(index: number): StepState {
    if (index < currentStep) return "done";
    if (index === currentStep) return "active";
    return "pending";
  }

  return (
    <section className="px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-[480px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-5 flex h-14 w-14 animate-[pulse-glow_2s_ease-in-out_infinite] items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-hover shadow-lg sm:mb-6 sm:h-16 sm:w-16"
        >
          <Image
            src="/nuvemshop-logo.png"
            alt=""
            width={40}
            height={40}
            className="h-8 w-8 rounded-md sm:h-10 sm:w-10"
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-xl font-bold text-primary sm:mb-8 sm:text-2xl"
        >
          Analisando sua loja...
        </motion.h2>

        <div className="flex flex-col gap-2.5 text-left sm:gap-3">
          {STEPS.map((text, i) => {
            const state = getStepState(i);
            const isVisible = i <= currentStep;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={
                  isVisible
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 8 }
                }
                transition={{ duration: 0.4 }}
                className={`flex items-center gap-3 rounded-lg border px-3 py-3 transition-colors sm:gap-3.5 sm:px-4 sm:py-3.5 ${
                  state === "done"
                    ? "border-success/20 bg-success-light"
                    : state === "active"
                      ? "border-accent bg-white shadow-[0_0_0_3px_rgba(0,80,195,0.06)]"
                      : "border-border bg-white"
                }`}
              >
                <StepIcon state={state} />
                <span className="text-[13px] font-medium text-primary sm:text-[15px]">
                  {text}
                </span>
                <span
                  className={`ml-auto text-[11px] font-semibold sm:text-[13px] ${
                    state === "done"
                      ? "text-success"
                      : state === "active"
                        ? "text-accent"
                        : "text-neutral-300"
                  }`}
                >
                  {state === "done"
                    ? "Concluído"
                    : state === "active"
                      ? "Processando..."
                      : "Aguardando"}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
