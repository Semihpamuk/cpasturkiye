"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

/* ─────────────── Kart ödemesi sonrası: "ekibimiz sizi arayacak" ─────────────── */

export default function SuccessJourney({ orderId }: { orderId: string }) {
  const reduceMotion = useReducedMotion();

  const steps = [
    {
      title: "Ödemeniz alındı",
      description: orderId
        ? `Sipariş numaranız: ${orderId}. Onay e-postanız yola çıktı.`
        : "Ödemeniz başarıyla alındı. Sipariş kaydınız ekibimizce tamamlanıp e-posta ile iletilecek.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
      state: "done" as const,
    },
    {
      title: "Ekip arkadaşımız sizi arayacak",
      description:
        "24 saat içinde (iş günü) kayıtlı telefonunuzdan aranacaksınız. Bu görüşmede hedefler netleşir ve kurulum planınız çıkarılır.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
        />
      ),
      state: "next" as const,
    },
    {
      title: "Kurulum başlıyor",
      description:
        "Yetkilendirmelerin ardından ortalama 7 iş günü içinde katalog bağlantınız, ölçümlemeniz ve kampanyalarınız yayında olur.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
        />
      ),
      state: "upcoming" as const,
    },
  ];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.35, delayChildren: 0.3 } },
  };
  const item = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="flex min-h-[75vh] items-center justify-center px-4 py-20">
      <div className="w-full max-w-xl">
        <motion.div
          initial={reduceMotion ? { scale: 1 } : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50"
        >
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <motion.h1
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-6 text-center font-display text-3xl font-extrabold text-ink-900"
        >
          Teşekkürler — başlıyoruz! 🎉
        </motion.h1>

        <motion.ol variants={container} initial="hidden" animate="show" className="relative mt-10 space-y-0">
          {steps.map((step, i) => (
            <motion.li key={step.title} variants={item} className="relative flex gap-4 pb-10 last:pb-0">
              {i < steps.length - 1 && (
                <span className="absolute left-[23px] top-12 h-[calc(100%-3rem)] w-0.5 bg-ink-200" aria-hidden="true" />
              )}
              <span
                className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${
                  step.state === "done"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : step.state === "next"
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-ink-200 bg-white text-ink-500"
                }`}
              >
                {step.state === "next" && (
                  <span className="absolute inset-0 animate-ping-soft rounded-full bg-brand-400/30" aria-hidden="true" />
                )}
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {step.icon}
                </svg>
              </span>
              <div className="pt-1">
                <p className={`font-display text-base font-bold ${step.state === "upcoming" ? "text-ink-500" : "text-ink-900"}`}>
                  {step.title}
                  {step.state === "next" && (
                    <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
                      Sıradaki adım
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">{step.description}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>

        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-10 rounded-2xl border border-ink-200 bg-ink-50 p-5 text-center"
        >
          <p className="text-sm text-ink-600">
            Bu arada aklınıza bir şey takılırsa:{" "}
            <Link href="/iletisim" className="font-semibold text-brand-700 underline">
              iletişim sayfası
            </Link>{" "}
            ya da onay e-postasındaki numaradan bize ulaşın.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-xl bg-ink-900 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-700"
          >
            Anasayfaya Dön
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
