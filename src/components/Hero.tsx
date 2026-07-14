"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import AnimatedBeamFlow from "./AnimatedBeamFlow";

const HEADLINE_LINES = [
  ["Pazaryeri", "reklamlarınızı"],
  ["Meta'da", "biz", "yönetiyoruz."],
];

const MARKETPLACE_CHIPS = [
  { label: "Trendyol", color: "#f27a1a", soon: false },
  { label: "Hepsiburada", color: "#ff6000", soon: false },
  { label: "Amazon", color: "#ff9900", soon: true },
];

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.08 },
    },
  };
  const item = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="section-dark relative overflow-hidden">
      <div className="bg-dot-grid-dark absolute inset-0" aria-hidden="true" />
      {/* Işıma */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-meta/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-[320px] w-[420px] rounded-full bg-brand-600/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8 lg:pb-28 lg:pt-24">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Rozet */}
          <motion.p
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-ink-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-emerald-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Meta CPAS Kurulum & Yönetim Hizmeti
          </motion.p>

          {/* Başlık — kelime kelime giriş */}
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {HEADLINE_LINES.map((line, li) => (
              <span key={li} className="block">
                {line.map((word, wi) => (
                  <motion.span
                    key={`${li}-${wi}`}
                    variants={item}
                    className={`inline-block ${
                      word === "Meta'da" ? "text-meta-light" : ""
                    } ${wi > 0 ? "ml-[0.28em]" : ""}`}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg"
          >
            Mağazanızın kataloğunu Meta&apos;ya bağlıyor, Facebook ve Instagram
            reklamlarınızı <strong className="font-semibold text-white">gerçek satış verisiyle</strong>{" "}
            biz kuruyor, biz yönetiyoruz. Siz satışa odaklanın.
          </motion.p>

          {/* Pazaryeri çipleri */}
          <motion.div variants={item} className="mt-7 flex flex-wrap items-center gap-3">
            {MARKETPLACE_CHIPS.map((m) => (
              <span
                key={m.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white"
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
                {m.label}
                {m.soon && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-300">
                    Yakında
                  </span>
                )}
              </span>
            ))}
          </motion.div>

          {/* CTA'lar */}
          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/satin-al"
              className="group relative overflow-hidden rounded-xl bg-brand-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-500 hover:shadow-brand-500/30"
            >
              <span className="relative z-10">Hemen Başla →</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
            <Link
              href="/iletisim"
              className="rounded-xl border border-white/15 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/5"
            >
              Ücretsiz Ön Analiz
            </Link>
          </motion.div>

          <motion.p variants={item} className="mt-6 text-xs text-ink-500">
            Kurulum ortalama 7 iş günü · Her hafta performans raporu · Sözleşmeli çalışma
          </motion.p>
        </motion.div>

        {/* Akış animasyonu */}
        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl border border-white/10 bg-ink-900/60 p-4 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-6"
        >
          <AnimatedBeamFlow />
        </motion.div>
      </div>
    </section>
  );
}
