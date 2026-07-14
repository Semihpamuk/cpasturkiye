"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { computeOrderQuote, formatTRY, MARKETPLACES } from "@/lib/site";
import { useSettings } from "@/lib/useSettings";

type InvoiceType = "individual" | "company";
type Step = "details" | "payment" | "done" | "failed";

interface AppliedDiscount {
  code: string;
  type: "percent" | "fixed";
  value: number;
}

/* ─────────────── Ödeme sonrası: "ekibimiz sizi arayacak" sekansı ─────────────── */

function SuccessJourney({ orderId }: { orderId: string }) {
  const reduceMotion = useReducedMotion();

  const steps = [
    {
      title: "Ödemeniz alındı",
      description: `Sipariş numaranız: ${orderId}. Onay e-postanız yola çıktı.`,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      ),
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

        <motion.ol
          variants={container}
          initial="hidden"
          animate="show"
          className="relative mt-10 space-y-0"
        >
          {steps.map((step, i) => (
            <motion.li key={step.title} variants={item} className="relative flex gap-4 pb-10 last:pb-0">
              {/* Dikey bağlantı hattı */}
              {i < steps.length - 1 && (
                <span className="absolute left-[23px] top-12 h-[calc(100%-3rem)] w-0.5 bg-ink-200" aria-hidden="true" />
              )}
              <span
                className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${
                  step.state === "done"
                    ? "border-green-500 bg-green-50 text-green-600"
                    : step.state === "next"
                      ? "border-brand-500 bg-brand-50 text-brand-600"
                      : "border-ink-200 bg-white text-ink-400"
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
                <p
                  className={`font-display text-base font-bold ${
                    step.state === "upcoming" ? "text-ink-500" : "text-ink-900"
                  }`}
                >
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

/* ─────────────────────────────── Checkout ─────────────────────────────── */

export default function CheckoutClient() {
  const { pricing } = useSettings();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>("details");
  const [marketplaces, setMarketplaces] = useState<string[]>(["trendyol"]);

  const [codeInput, setCodeInput] = useState("");
  const [codeStatus, setCodeStatus] = useState<"idle" | "checking" | "invalid">("idle");
  const [discount, setDiscount] = useState<AppliedDiscount | null>(null);

  const [form, setForm] = useState({ name: "", phone: "", email: "", storeUrl: "" });
  const [invoiceType, setInvoiceType] = useState<InvoiceType>("company");
  const [invoice, setInvoice] = useState({
    identityNo: "",
    companyName: "",
    taxOffice: "",
    taxNumber: "",
    address: "",
    city: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [checkoutFormContent, setCheckoutFormContent] = useState("");
  const iyzFormRef = useRef<HTMLDivElement>(null);

  // URL paramları: ?payment=success|failure → sonuç ekranı
  useEffect(() => {
    const payment = searchParams.get("payment");
    const oid = searchParams.get("orderId");

    if (payment === "success" && oid) {
      setOrderId(oid);
      setStep("done");
    } else if (payment === "failure" || payment === "error") {
      setStep("failed");
    }
  }, [searchParams]);

  // iyzico ödeme formu scriptlerini DOM'a enjekte et
  useEffect(() => {
    if (step !== "payment" || !checkoutFormContent || !iyzFormRef.current) return;

    const container = iyzFormRef.current;
    container.innerHTML = checkoutFormContent;

    Array.from(container.querySelectorAll("script")).forEach((oldScript) => {
      const newScript = document.createElement("script");
      if (oldScript.src) {
        newScript.src = oldScript.src;
        newScript.async = true;
      } else {
        newScript.textContent = oldScript.textContent ?? "";
      }
      document.head.appendChild(newScript);
      oldScript.remove();
    });
  }, [step, checkoutFormContent]);

  const quote = useMemo(
    () =>
      computeOrderQuote(
        { discount: discount ? { type: discount.type, value: discount.value } : null },
        pricing
      ),
    [discount, pricing]
  );

  function toggleMarketplace(key: string) {
    setMarketplaces((current) =>
      current.includes(key)
        ? current.filter((m) => m !== key)
        : [...current, key]
    );
  }

  async function applyCode() {
    if (!codeInput.trim()) return;
    setCodeStatus("checking");
    try {
      const res = await fetch("/api/discount/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeInput }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscount({ code: data.code, type: data.type, value: data.value });
        setCodeStatus("idle");
      } else {
        setDiscount(null);
        setCodeStatus("invalid");
      }
    } catch {
      setCodeStatus("invalid");
    }
  }

  async function startPayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (marketplaces.length === 0) {
      setSubmitError("Lütfen en az bir pazaryeri seçin.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          marketplaces,
          discountCode: discount?.code || "",
          invoiceType,
          ...invoice,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Ödeme başlatılamadı, lütfen tekrar deneyin.");
        return;
      }
      setCheckoutFormContent(data.checkoutFormContent as string);
      setStep("payment");
    } catch {
      setSubmitError("Bağlantı hatası — lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Başarılı ödeme ── */
  if (step === "done") {
    return <SuccessJourney orderId={orderId} />;
  }

  /* ── Başarısız ödeme ── */
  if (step === "failed") {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-4 py-20">
        <div className="max-w-lg text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-ink-900">
            Ödeme tamamlanamadı
          </h1>
          <p className="mt-4 leading-relaxed text-ink-600">
            Ödeme işlemi başarısız oldu ya da iptal edildi. Kart bilgilerinizi kontrol
            edip tekrar deneyebilirsiniz.
          </p>
          <button
            type="button"
            onClick={() => {
              setStep("details");
              window.history.replaceState({}, "", "/satin-al");
            }}
            className="mt-8 inline-block rounded-xl bg-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-700"
          >
            Tekrar Dene
          </button>
          <p className="mt-4 text-sm text-ink-500">
            Yardım için{" "}
            <Link href="/iletisim" className="font-semibold text-brand-700 underline">
              bizimle iletişime geçin
            </Link>
          </p>
        </div>
      </section>
    );
  }

  /* ── iyzico ödeme formu ── */
  if (step === "payment") {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          <p className="text-sm text-ink-600">
            Güvenli ödeme formu yükleniyor...
          </p>
          <p className="mt-1 text-xs text-ink-400">
            iyzico altyapısıyla 256-bit SSL şifreli ödeme
          </p>
        </div>
        <div ref={iyzFormRef} id="iyzipay-checkout-form" className="w-full max-w-lg" />
      </section>
    );
  }

  /* ── Ana form ── */
  return (
    <section className="bg-gradient-to-b from-ink-50 to-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Hemen başlayın
          </h1>
          <p className="mt-3 text-ink-600">
            Kurulum + ilk ay yönetim paketini güvenli ödemeyle satın alın. Ödemenin
            ardından ekip arkadaşımız <strong>24 saat içinde</strong> sizi arayarak
            kurulum planınızı netleştirir.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* ===== SOL: Form ===== */}
          <form onSubmit={startPayment} className="space-y-8">
            {/* Pazaryeri seçimi */}
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-ink-900">
                1. Hangi pazaryerlerinde satıyorsunuz?
              </h2>
              <p className="mt-1 text-xs text-ink-500">
                Paket fiyatı aynıdır; seçtiğiniz tüm pazaryerleri birlikte yönetilir.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {MARKETPLACES.map((m) => {
                  const selected = marketplaces.includes(m.key);
                  const isSoon = m.status === "soon";
                  return (
                    <button
                      key={m.key}
                      type="button"
                      disabled={isSoon}
                      onClick={() => toggleMarketplace(m.key)}
                      className={`relative rounded-xl border-2 p-4 text-left transition-colors ${
                        isSoon
                          ? "cursor-not-allowed border-ink-100 bg-ink-50 opacity-60"
                          : selected
                            ? "border-brand-500 bg-brand-50"
                            : "border-ink-200 hover:border-ink-300"
                      }`}
                    >
                      {isSoon && (
                        <span className="absolute -top-2.5 right-3 rounded-full bg-ink-400 px-2.5 py-0.5 text-[10px] font-bold text-white">
                          YAKINDA
                        </span>
                      )}
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                        <span className="font-display text-sm font-bold text-ink-900">{m.label}</span>
                      </span>
                      <span className="mt-1 block text-xs text-ink-500">
                        {isSoon ? "Entegrasyon çok yakında" : selected ? "✓ Seçildi" : "Seçmek için tıklayın"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* İletişim bilgileri */}
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-ink-900">
                2. İletişim bilgileriniz
              </h2>
              <p className="mt-1 text-xs text-ink-500">
                Kurulum görüşmesi bu bilgilerle yapılır — telefonunuzu doğru yazdığınızdan emin olun.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input
                  required
                  type="text"
                  placeholder="Ad Soyad *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
                <input
                  required
                  type="tel"
                  placeholder="Telefon *"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
                <input
                  required
                  type="email"
                  placeholder="E-posta *"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
                <input
                  type="url"
                  placeholder="Mağaza linki (Trendyol/Hepsiburada)"
                  value={form.storeUrl}
                  onChange={(e) => setForm({ ...form, storeUrl: e.target.value })}
                  className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            {/* Fatura bilgileri */}
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-ink-900">
                3. Fatura bilgileriniz
              </h2>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setInvoiceType("company")}
                  className={`flex-1 rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                    invoiceType === "company"
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-ink-200 text-ink-600 hover:border-ink-300"
                  }`}
                >
                  Kurumsal (Şirket)
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceType("individual")}
                  className={`flex-1 rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                    invoiceType === "individual"
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-ink-200 text-ink-600 hover:border-ink-300"
                  }`}
                >
                  Bireysel
                </button>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {invoiceType === "individual" ? (
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="TC Kimlik No"
                    value={invoice.identityNo}
                    onChange={(e) =>
                      setInvoice({ ...invoice, identityNo: e.target.value })
                    }
                    className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:col-span-2"
                  />
                ) : (
                  <>
                    <input
                      required
                      type="text"
                      placeholder="Şirket / Ticari Unvan *"
                      value={invoice.companyName}
                      onChange={(e) =>
                        setInvoice({ ...invoice, companyName: e.target.value })
                      }
                      className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:col-span-2"
                    />
                    <input
                      required
                      type="text"
                      placeholder="Vergi Dairesi *"
                      value={invoice.taxOffice}
                      onChange={(e) =>
                        setInvoice({ ...invoice, taxOffice: e.target.value })
                      }
                      className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                    <input
                      required
                      type="text"
                      inputMode="numeric"
                      placeholder="Vergi No *"
                      value={invoice.taxNumber}
                      onChange={(e) =>
                        setInvoice({ ...invoice, taxNumber: e.target.value })
                      }
                      className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </>
                )}
                <input
                  required
                  type="text"
                  placeholder="Şehir *"
                  value={invoice.city}
                  onChange={(e) => setInvoice({ ...invoice, city: e.target.value })}
                  className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
                <textarea
                  required
                  rows={2}
                  placeholder="Fatura Adresi *"
                  value={invoice.address}
                  onChange={(e) =>
                    setInvoice({ ...invoice, address: e.target.value })
                  }
                  className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:col-span-2"
                />
              </div>
            </div>

            {/* İndirim kodu */}
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-ink-900">
                İndirim kodu{" "}
                <span className="font-sans text-xs font-normal text-ink-400">
                  (varsa)
                </span>
              </h2>
              {discount ? (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                  <p className="text-sm font-semibold text-green-800">
                    ✓ {discount.code} uygulandı —{" "}
                    {discount.type === "percent"
                      ? `%${discount.value} indirim`
                      : `${formatTRY(discount.value)} indirim`}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setDiscount(null);
                      setCodeInput("");
                    }}
                    className="text-xs font-semibold text-green-700 underline"
                  >
                    Kaldır
                  </button>
                </div>
              ) : (
                <div className="mt-4 flex gap-3">
                  <input
                    type="text"
                    value={codeInput}
                    onChange={(event) => {
                      setCodeInput(event.target.value.toUpperCase());
                      setCodeStatus("idle");
                    }}
                    placeholder="ÖRN: HOSGELDIN10"
                    className="flex-1 rounded-lg border border-ink-300 px-4 py-2.5 text-sm uppercase tracking-wider text-ink-900 placeholder:normal-case placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                  <button
                    type="button"
                    onClick={applyCode}
                    disabled={codeStatus === "checking" || !codeInput.trim()}
                    className="rounded-lg bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-700 disabled:opacity-50"
                  >
                    {codeStatus === "checking" ? "..." : "Uygula"}
                  </button>
                </div>
              )}
              {codeStatus === "invalid" && (
                <p className="mt-2 text-xs font-medium text-red-600">
                  Kod geçersiz veya süresi dolmuş.
                </p>
              )}
            </div>

            {submitError && (
              <p className="text-sm font-medium text-red-600">{submitError}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-brand-600 px-6 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting ? "Ödeme başlatılıyor..." : "Güvenli Ödemeye Geç →"}
            </button>
            <p className="text-center text-[11px] text-ink-400">
              iyzico altyapısıyla 256-bit SSL şifreli güvenli ödeme · 9&apos;a kadar taksit
            </p>
          </form>

          {/* ===== SAĞ: Sipariş özeti ===== */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-lg">
              <h2 className="font-display text-lg font-bold text-ink-900">
                Sipariş özeti
              </h2>

              <div className="mt-4 rounded-xl bg-ink-50 p-4">
                <p className="font-display text-sm font-bold text-ink-900">
                  Kurulum + İlk Ay Yönetim Paketi
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">
                  Yetkilendirme, katalog bağlantısı, ölçümleme, kampanya mimarisi,
                  canlıya alma ve ilk ayın tam yönetimi.
                </p>
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-600">Paket bedeli</dt>
                  <dd className="font-semibold text-ink-900">
                    {formatTRY(quote.setupNet)}
                  </dd>
                </div>
                {quote.discountAmount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <dt>İndirim ({discount?.code})</dt>
                    <dd className="font-semibold">
                      −{formatTRY(quote.discountAmount)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-ink-100 pt-3">
                  <dt className="text-ink-600">Ara toplam</dt>
                  <dd className="font-semibold text-ink-900">
                    {formatTRY(quote.netAfterDiscount)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-600">KDV (%20)</dt>
                  <dd className="font-semibold text-ink-900">
                    {formatTRY(quote.vatAmount)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t-2 border-ink-900 pt-4">
                  <dt className="font-display text-base font-bold text-ink-900">
                    Bugün ödenecek
                  </dt>
                  <dd className="font-display text-2xl font-extrabold text-ink-900">
                    {formatTRY(quote.total)}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 rounded-xl border border-ink-100 bg-ink-50/70 p-4">
                <p className="text-xs font-bold text-ink-700">
                  2. aydan itibaren: {formatTRY(quote.managementMonthly)} + KDV / ay
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">
                  Aylık yönetim bedeli fatura karşılığı tahsil edilir. Taahhüt yok —
                  dilediğiniz ay durdurabilirsiniz.
                </p>
              </div>

              {/* iyzico / kart logoları */}
              <div className="mt-5 rounded-xl border border-ink-100 bg-ink-50 px-4 py-3">
                <p className="mb-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                  Güvenli Ödeme
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="flex items-center gap-1 rounded-md border border-[#1A1A2E]/20 bg-[#1A1A2E] px-2.5 py-1">
                    <span className="text-[11px] font-bold tracking-tight text-white">iyzico</span>
                    <span className="text-[9px] text-blue-300">ile Öde</span>
                  </span>
                  <span className="flex h-7 w-12 items-center justify-center rounded-md border border-ink-200 bg-white px-1.5">
                    <span className="font-display text-base font-black italic text-[#1A1F71]">VISA</span>
                  </span>
                  <span className="flex h-7 w-12 items-center justify-center rounded-md border border-ink-200 bg-white px-1">
                    <span className="flex">
                      <span className="h-5 w-5 rounded-full bg-[#EB001B] opacity-90" />
                      <span className="-ml-2.5 h-5 w-5 rounded-full bg-[#F79E1B] opacity-90" />
                    </span>
                  </span>
                  <span className="flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-2 py-1">
                    <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[10px] font-semibold text-green-700">SSL</span>
                  </span>
                </div>
              </div>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-ink-400">
                Ödeme sonrası ekip arkadaşımız 24 saat içinde sizi arar.{" "}
                <Link href="/mesafeli-satis-sozlesmesi" className="underline">
                  Mesafeli Satış Sözleşmesi
                </Link>
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-ink-200 bg-ink-50 p-5 text-xs leading-relaxed text-ink-600">
              <p className="font-bold text-ink-900">💬 Önce konuşmak mı istersiniz?</p>
              <p className="mt-1">
                Mağazanızın CPAS&apos;e uygunluğunu ücretsiz değerlendirelim.{" "}
                <Link href="/iletisim" className="font-semibold text-brand-700 underline">
                  Sizi arayalım →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
