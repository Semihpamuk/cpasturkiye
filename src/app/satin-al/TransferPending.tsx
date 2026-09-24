"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

/* ─────────────── Havale sonrası: "dekontunuz alındı, onay bekliyor" ─────────────── */

export default function TransferPending({ orderId }: { orderId: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <section className="flex min-h-[75vh] items-center justify-center px-4 py-20">
      <div className="w-full max-w-xl text-center">
        <motion.div
          initial={reduceMotion ? { scale: 1 } : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 ring-8 ring-brand-50"
        >
          <svg className="h-8 w-8 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>

        <h1 className="mt-6 font-display text-3xl font-extrabold text-ink-900">
          Dekontunuz alındı — teşekkürler!
        </h1>
        <p className="mt-4 leading-relaxed text-ink-600">
          Sipariş numaranız: <strong className="text-ink-900">{orderId}</strong>. Ödemeniz kontrol
          ediliyor; havale/EFT hesabımıza ulaştığı doğrulanınca siparişiniz onaylanır ve
          ekip arkadaşımız <strong>24 saat içinde (iş günü)</strong> sizi arayarak kurulum
          planınızı netleştirir.
        </p>
        <div className="mt-8 rounded-2xl border border-ink-200 bg-ink-50 p-5 text-left text-sm text-ink-600">
          <p className="font-bold text-ink-900">Sırada ne var?</p>
          <ul className="mt-3 space-y-2">
            <li className="flex gap-2"><span className="text-brand-700">1.</span> Ödemenizi doğrularız (genelde aynı iş günü).</li>
            <li className="flex gap-2"><span className="text-brand-700">2.</span> Onay e-postanız gönderilir.</li>
            <li className="flex gap-2"><span className="text-brand-700">3.</span> Ekip sizi arar, kurulum başlar.</li>
          </ul>
        </div>
        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-ink-900 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-700"
        >
          Anasayfaya Dön
        </Link>
      </div>
    </section>
  );
}
