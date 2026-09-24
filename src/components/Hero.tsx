import { Fragment, type CSSProperties } from "react";
import Link from "next/link";
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

/**
 * Giriş animasyonu CSS ile (globals.css: .hero-in / .hero-rise / .hero-scale).
 *
 * Önceden `motion` ile initial="hidden" kullanılıyordu: sunucu HTML'i başlığa ve
 * paragrafa opacity:0 basıyor, JS yüklenip hidrasyon bitene kadar (mobilde
 * ~2,3 s) LCP metni görünmüyordu (Lighthouse "element render delay").
 * CSS animasyonu ilk boyamayla başlar; LCP elemanı olan paragraf yalnızca
 * yükselir (opacity'ye dokunulmaz) ki ilk karede sayılsın. Hero artık
 * istemci bileşeni değil, motion paketi bu sayfadan çıktı.
 */
const delay = (ms: number): CSSProperties => ({ "--hero-delay": `${ms}ms` } as CSSProperties);

export default function Hero() {
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
        <div>
          {/* Rozet */}
          <p
            style={delay(0)}
            className="hero-in inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-ink-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-emerald-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Meta CPAS Kurulum & Yönetim Hizmeti
          </p>

          {/* Başlık — kelime kelime giriş */}
          {/* Kelime kelime giriş için her kelime inline-block'tur. Kelimeler
              arasındaki boşluk margin ile DEĞİL gerçek boşluk karakteriyle
              verilir — margin kullanıldığında satır sonuna taşan kelime
              boşluğu da beraberinde taşıyıp başlığı içeri kaydırıyordu. */}
          <h1 className="mt-6 text-balance font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {HEADLINE_LINES.map((line, li) => (
              <span key={li} className="block">
                {line.map((word, wi) => (
                  <Fragment key={`${li}-${wi}`}>
                    {wi > 0 && " "}
                    <span
                      style={delay(60 + (li * 2 + wi) * 60)}
                      className={`hero-in inline-block ${
                        word === "Meta'da" ? "text-meta-light" : ""
                      }`}
                    >
                      {word}
                    </span>
                  </Fragment>
                ))}
              </span>
            ))}
          </h1>

          {/* LCP elemanı: yalnızca yükselir, hiç saydam olmaz */}
          <p
            style={delay(200)}
            className="hero-rise mt-6 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg"
          >
            Mağazanızın kataloğunu Meta&apos;ya bağlıyor, Facebook ve Instagram
            reklamlarınızı <strong className="font-semibold text-white">gerçek satış verisiyle</strong>{" "}
            biz kuruyor, biz yönetiyoruz. Siz satışa odaklanın.
          </p>

          {/* Kelime köprüsü: sitenin ticari sayfaları yalnızca "CPAS" terimiyle
              yazılmıştı. GSC (24 Eyl 2026): "cpas" ailesinde 1,8-3,9. sıradayız
              ama "trendyol meta reklamı" aramasında hiçbir hizmet sayfamız
              çıkmıyor — yalnızca blog yazısı, o da 8,7'de. Bu satır terimi
              bilmeyen satıcıya ne sattığımızı anlatır ve iki kelime dağarcığını
              birbirine bağlar.

              LCP elemanının ALTINDA ve ondan küçük tutuldu: üstteki paragraf
              LCP olarak kalmalı. */}
          <p
            style={delay(260)}
            className="hero-in mt-4 max-w-xl text-sm leading-relaxed text-ink-400"
          >
            Sektörde CPAS (Collaborative Ads) deniyor; düz anlatımıyla{" "}
            <strong className="font-semibold text-ink-200">
              Trendyol ve Hepsiburada mağazanız için Meta reklamları
            </strong>
            .
          </p>

          {/* Pazaryeri çipleri */}
          <div style={delay(320)} className="hero-in mt-7 flex flex-wrap items-center gap-3">
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
          </div>

          {/* CTA'lar */}
          <div style={delay(400)} className="hero-in mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/satin-al"
              className="group relative overflow-hidden rounded-xl bg-brand-700 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-800 hover:shadow-brand-500/30"
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
          </div>

          {/* Koyu zemin: ink-500 burada 4.0:1'de kalıyor, ink-400 7.5:1 verir. */}
          <p style={delay(480)} className="hero-in mt-6 text-xs text-ink-400">
            Kurulum ortalama 7 iş günü · Her hafta performans raporu · Sözleşmeli çalışma
          </p>
        </div>

        {/* Akış animasyonu */}
        {/* Diyagram mobilde GİZLİ: 760×440 SVG telefonda okunmuyordu (etiketler
            ~8px) ve sürekli CSS animasyonlarıyla mobil ana iş parçacığını
            meşgul ediyordu. sm (640px) ve üstünde görünür. */}
        <div
          style={delay(300)}
          className="hero-scale relative hidden rounded-3xl sm:block border border-white/10 bg-ink-900/60 p-4 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-6"
        >
          <AnimatedBeamFlow />
        </div>
      </div>
    </section>
  );
}
