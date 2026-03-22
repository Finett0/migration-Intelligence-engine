"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Platform, RevenueRange, Pain } from "@/types/report";
import type { AnalysisResult } from "@/types/report";
import { fetchAnalysis } from "@/lib/analyze";

import { Navbar } from "@/components/sections/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { QualificationForm } from "@/components/sections/QualificationForm";
import { LoadingAnalysis } from "@/components/sections/LoadingAnalysis";
import { EconomyReport } from "@/components/sections/EconomyReport";
import { MigrationPlan } from "@/components/sections/MigrationPlan";
import { QuickWins } from "@/components/sections/QuickWins";
import { CTASection } from "@/components/sections/CTASection";
import { Footer } from "@/components/sections/Footer";

type Step = "hero" | "qualification" | "loading" | "report";

export default function Home() {
  const [step, setStep] = useState<Step>("hero");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleUrlSubmit = useCallback((submittedUrl: string) => {
    setUrl(submittedUrl);
    setStep("qualification");
  }, []);

  const handleGoHome = useCallback(() => {
    setStep("hero");
    setUrl("");
    setResult(null);
  }, []);

  const handleQualificationClose = useCallback(() => {
    setStep("hero");
  }, []);

  const handleQualificationSubmit = useCallback(
    (platform: Platform, revenue: RevenueRange, pains: Pain[]) => {
      setResult(null);
      setStep("loading");
      // Fetch real analysis from API (scraping + LLM) while loading animation plays
      fetchAnalysis(url, platform, revenue, pains).then((analysis) => {
        setResult(analysis);
      });
    },
    [url],
  );

  const handleLoadingComplete = useCallback(() => {
    setStep("report");
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onGoHome={handleGoHome} />

      <AnimatePresence mode="wait">
        {step === "hero" && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="-mt-[74px] flex flex-1 flex-col"
          >
            <HeroSection onSubmitUrl={handleUrlSubmit} />
          </motion.div>
        )}

        {step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingAnalysis onComplete={handleLoadingComplete} analysisReady={result !== null} />
          </motion.div>
        )}

        {step === "report" && result && (
          <motion.div
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="px-0 sm:px-6 lg:px-8">
              <EconomyReport result={result} />
              <hr className="mx-4 max-w-[1000px] border-border sm:mx-auto" />
              <MigrationPlan result={result} />
              <hr className="mx-4 max-w-[1000px] border-border sm:mx-auto" />
              <QuickWins result={result} />
            </div>
            <CTASection annualSavings={result.costs.annualSavings} />
          </motion.div>
        )}
      </AnimatePresence>

      <QualificationForm
        open={step === "qualification"}
        onClose={handleQualificationClose}
        onSubmit={handleQualificationSubmit}
      />

      <Footer />
    </div>
  );
}
