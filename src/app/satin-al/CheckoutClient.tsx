"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import {
  computeOrderQuote,
  formatTRY,
  MARKETPLACES,
  BANK_ACCOUNTS,
  type PaymentMethod,
} from "@/lib/site";
import { useSettings } from "@/lib/useSettings";

type InvoiceType = "individual" | "company";
type Step = "details" | "payment" | "done" | "failed" | "transfer_pending";

interface AppliedDiscount {
  code: string;
  type: "percent" | "fixed";
  value: number;
}

const MAX_RECEIPT_MB = 10;

/* ─────────────── Kart ödemesi sonrası: "ekibimiz sizi arayacak" ─────────────── */

function SuccessJourney({ orderId }: { orderId: string }) {
  const reduceMotion = useReducedMotion();

  const steps = [
    {
      title: "Ödemeniz alındı",
      description: `Sipariş numaranız: ${orderId}. Onay e-postanız yola çıktı.`,
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

/* ─────────────── Havale sonrası: "dekontunuz alındı, onay bekliyor" ─────────────── */

function TransferPending({ orderId }: { orderId: string }) {
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
          <svg className="h-8 w-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
            <li className="flex gap-2"><span className="text-brand-600">1.</span> Ödemenizi doğrularız (genelde aynı iş günü).</li>
            <li className="flex gap-2"><span className="text-brand-600">2.</span> Onay e-postanız gönderilir.</li>
            <li className="flex gap-2"><span className="text-brand-600">3.</span> Ekip sizi arar, kurulum başlar.</li>
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

/* ─────────────────────────────── Checkout ─────────────────────────────── */

export default function CheckoutClient() {
  const { pricing } = useSettings();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>("details");
  const [marketplaces, setMarketplaces] = useState<string[]>(["trendyol"]);
  const [addManagement, setAddManagement] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

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

  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptAccountName, setReceiptAccountName] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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
        {
          marketplaceCount: marketplaces.length || 1,
          addManagement,
          paymentMethod,
          discount: discount ? { type: discount.type, value: discount.value } : null,
        },
        pricing
      ),
    [marketplaces.length, addManagement, paymentMethod, discount, pricing]
  );

  function toggleMarketplace(key: string) {
    setMarketplaces((current) =>
      current.includes(key) ? current.filter((m) => m !== key) : [...current, key]
    );
  }

  function selectPayment(method: PaymentMethod) {
    setPaymentMethod(method);
    setSubmitError("");
    // Havalede indirim kodu geçersiz — temizle.
    if (method === "transfer") {
      setDiscount(null);
      setCodeInput("");
      setCodeStatus("idle");
    }
  }

  async function copyText(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      /* pano erişimi yoksa sessiz geç */
    }
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

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (marketplaces.length === 0) {
      setSubmitError("Lütfen en az bir pazaryeri seçin.");
      return;
    }
    if (paymentMethod === "transfer") {
      await submitTransfer();
    } else {
      await startCardPayment();
    }
  }

  async function startCardPayment() {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          marketplaces,
          addManagement,
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

  async function submitTransfer() {
    if (!receipt && !receiptAccountName.trim()) {
      setSubmitError("Dekont yükleyin veya ödeme yapılan hesabın resmi ismini yazın.");
      return;
    }
    if (receipt && receipt.size > MAX_RECEIPT_MB * 1024 * 1024) {
      setSubmitError(`Dekont dosyası ${MAX_RECEIPT_MB} MB'den küçük olmalıdır.`);
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const fd = new FormData();
      if (receipt) fd.append("receipt", receipt);
      fd.append(
        "payload",
        JSON.stringify({
          ...form,
          marketplaces,
          addManagement,
          invoiceType,
          ...invoice,
          receiptAccountName: receiptAccountName.trim(),
        })
      );
      const res = await fetch("/api/payment/transfer", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Sipariş oluşturulamadı, lütfen tekrar deneyin.");
        return;
      }
      setOrderId(data.orderId as string);
      setStep("transfer_pending");
    } catch {
      setSubmitError("Bağlantı hatası — lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Sonuç ekranları ── */
  if (step === "done") return <SuccessJourney orderId={orderId} />;
  if (step === "transfer_pending") return <TransferPending orderId={orderId} />;

  if (step === "failed") {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-4 py-20">
        <div className="max-w-lg text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-ink-900">Ödeme tamamlanamadı</h1>
          <p className="mt-4 leading-relaxed text-ink-600">
            Ödeme işlemi başarısız oldu ya da iptal edildi. Kart bilgilerinizi kontrol edip tekrar
            deneyebilirsiniz.
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

  if (step === "payment") {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          <p className="text-sm text-ink-600">Güvenli ödeme formu yükleniyor...</p>
          <p className="mt-1 text-xs text-ink-400">iyzico altyapısıyla 256-bit SSL şifreli ödeme</p>
        </div>
        <div ref={iyzFormRef} id="iyzipay-checkout-form" className="w-full max-w-lg" />
      </section>
    );
  }

  /* ── Ana form ── */
  const isTransfer = paymentMethod === "transfer";

  return (
    <section className="bg-gradient-to-b from-ink-50 to-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Hemen başlayın
          </h1>
          <p className="mt-3 text-ink-600">
            Kurulum + ilk ay yönetim paketini satın alın. Ödemenin ardından ekip arkadaşımız{" "}
            <strong>24 saat içinde</strong> sizi arayarak kurulum planınızı netleştirir.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* ===== SOL: Form ===== */}
          <form onSubmit={onSubmit} className="space-y-8">
            {/* 1. Pazaryeri seçimi */}
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-ink-900">
                1. Hangi pazaryerlerinde satıyorsunuz?
              </h2>
              <p className="mt-1 text-xs text-ink-500">
                İkinci pazaryeri <strong className="text-brand-700">%50 indirimli</strong> eklenir —
                hepsi tek pakette birlikte yönetilir.
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
              {marketplaces.length >= 2 && (
                <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-xs font-medium text-brand-700">
                  🎉 İkili alım avantajı: 2. pazaryeri kurulum ve yönetimde %50 indirimli.
                </p>
              )}
            </div>

            {/* 2. Devam ödemesi (opsiyonel) */}
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-ink-900">
                2. Devam ayını da ekleyin{" "}
                <span className="font-sans text-xs font-normal text-ink-400">(opsiyonel)</span>
              </h2>
              <p className="mt-1 text-xs text-ink-500">
                Kurulum paketine ilk ay yönetim zaten dahil. İsterseniz bir sonraki ayın yönetimini
                de şimdi <strong className="text-brand-700">%10 indirimli</strong> peşin ekleyin —
                taahhüt değil, avantaj.
              </p>
              <button
                type="button"
                onClick={() => setAddManagement((v) => !v)}
                className={`mt-4 flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-colors ${
                  addManagement ? "border-brand-500 bg-brand-50" : "border-ink-200 hover:border-ink-300"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                      addManagement ? "border-brand-500 bg-brand-500 text-white" : "border-ink-300"
                    }`}
                  >
                    {addManagement && (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span>
                    <span className="block font-display text-sm font-bold text-ink-900">
                      Devam ayı yönetimi ekle
                    </span>
                    <span className="block text-xs text-ink-500">%10 indirimli peşin — 2 ayı birden kilitle</span>
                  </span>
                </span>
                <span className="text-right">
                  <span className="block font-display text-sm font-extrabold text-brand-700">
                    +{formatTRY(quote.managementAddon || Math.round(quote.managementMonthly * 0.9))}
                  </span>
                  <span className="block text-[10px] text-ink-400 line-through">
                    {formatTRY(quote.managementMonthly)}
                  </span>
                </span>
              </button>
            </div>

            {/* 3. Ödeme yöntemi */}
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-ink-900">3. Ödeme yöntemi</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => selectPayment("card")}
                  className={`rounded-xl border-2 p-4 text-left transition-colors ${
                    !isTransfer ? "border-brand-500 bg-brand-50" : "border-ink-200 hover:border-ink-300"
                  }`}
                >
                  <span className="font-display text-sm font-bold text-ink-900">Kredi / Banka Kartı</span>
                  <span className="mt-1 block text-xs text-ink-500">iyzico · 9&apos;a kadar taksit</span>
                </button>
                <button
                  type="button"
                  onClick={() => selectPayment("transfer")}
                  className={`relative rounded-xl border-2 p-4 text-left transition-colors ${
                    isTransfer ? "border-brand-500 bg-brand-50" : "border-ink-200 hover:border-ink-300"
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 rounded-full bg-green-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                    %5 İNDİRİM
                  </span>
                  <span className="font-display text-sm font-bold text-ink-900">Havale / EFT</span>
                  <span className="mt-1 block text-xs text-ink-500">%5 indirimli · dekont yükleyin</span>
                </button>
              </div>

              {/* Havale hesap bilgileri + dekont */}
              {isTransfer && (
                <div className="mt-5 space-y-4">
                  <div className="rounded-xl border border-ink-200 bg-ink-50/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-500">
                      Aşağıdaki hesaplardan birine {formatTRY(quote.total)} gönderin
                    </p>
                    <p className="mt-1 text-[11px] text-ink-500">
                      Açıklama kısmına ad-soyad ve telefonunuzu yazın. Tutar KDV dahildir.
                    </p>
                    <div className="mt-3 space-y-2.5">
                      {BANK_ACCOUNTS.map((acc) => (
                        <div
                          key={acc.iban}
                          className="rounded-lg border border-ink-200 bg-white px-3 py-3"
                        >
                          <p className="text-xs font-bold text-ink-900">{acc.bank}</p>

                          {/* IBAN + kopyala */}
                          <div className="mt-2 flex items-center gap-2">
                            <p className="min-w-0 flex-1 break-all font-mono text-xs text-ink-700">
                              {acc.iban}
                            </p>
                            <button
                              type="button"
                              onClick={() => copyText(acc.iban.replace(/\s/g, ""), `iban-${acc.iban}`)}
                              className="shrink-0 rounded-md border border-ink-300 px-2.5 py-1 text-[11px] font-semibold text-ink-700 transition-colors hover:border-brand-400 hover:text-brand-700"
                            >
                              {copiedKey === `iban-${acc.iban}` ? "✓ Kopyalandı" : "IBAN Kopyala"}
                            </button>
                          </div>

                          {/* Hesap sahibi ismi + kopyala */}
                          <div className="mt-1.5 flex items-center gap-2">
                            <p className="min-w-0 flex-1 break-words text-[11px] text-ink-500">
                              {acc.holder}
                            </p>
                            <button
                              type="button"
                              onClick={() => copyText(acc.holder, `holder-${acc.iban}`)}
                              className="shrink-0 rounded-md border border-ink-300 px-2.5 py-1 text-[11px] font-semibold text-ink-700 transition-colors hover:border-brand-400 hover:text-brand-700"
                            >
                              {copiedKey === `holder-${acc.iban}` ? "✓ Kopyalandı" : "İsmi Kopyala"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ink-800">
                      Havale/EFT dekontu
                    </label>
                    <p className="mt-1 text-xs text-ink-500">
                      Ödemeyi yaptıktan sonra dekontun ekran görüntüsünü veya PDF&apos;ini yükleyin
                      (JPG/PNG/PDF, en fazla {MAX_RECEIPT_MB} MB).{" "}
                      <strong className="text-ink-700">
                        Dekont yükleyemiyorsanız aşağıya ödeme yaptığınız hesabın resmi ismini yazın —
                        biri yeterli.
                      </strong>
                    </p>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,application/pdf"
                      onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
                      className="mt-2 block w-full text-sm text-ink-700 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-600 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700"
                    />
                    {receipt && (
                      <p className="mt-2 text-xs font-medium text-green-700">
                        ✓ {receipt.name} ({(receipt.size / 1024 / 1024).toFixed(1)} MB)
                      </p>
                    )}

                    {/* VEYA ayıracı */}
                    <div className="my-3 flex items-center gap-3">
                      <span className="h-px flex-1 bg-ink-200" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                        veya
                      </span>
                      <span className="h-px flex-1 bg-ink-200" />
                    </div>

                    <label className="block text-sm font-semibold text-ink-800">
                      Ödeme yapılan hesabın resmi ismi
                    </label>
                    <p className="mt-1 text-xs text-ink-500">
                      Havaleyi/EFT&apos;yi gönderdiğiniz banka hesabının tam resmi adı (ad-soyad veya
                      şirket unvanı). Ödemenizi eşleştirebilmemiz için gereklidir.
                    </p>
                    <input
                      type="text"
                      placeholder="Örn: Ahmet Yılmaz / Örnek Ltd. Şti."
                      value={receiptAccountName}
                      onChange={(e) => setReceiptAccountName(e.target.value)}
                      className="mt-2 w-full rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 4. İletişim bilgileri */}
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-ink-900">4. İletişim bilgileriniz</h2>
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

            {/* 5. Fatura bilgileri */}
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-ink-900">
                5. Fatura bilgileriniz{" "}
                <span className="font-sans text-xs font-normal text-ink-400">(opsiyonel)</span>
              </h2>
              <p className="mt-1 text-xs text-ink-500">
                Fatura kesilmesini isterseniz doldurun — dilerseniz sonradan da iletebilirsiniz.
              </p>
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
                    onChange={(e) => setInvoice({ ...invoice, identityNo: e.target.value })}
                    className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:col-span-2"
                  />
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Şirket / Ticari Unvan"
                      value={invoice.companyName}
                      onChange={(e) => setInvoice({ ...invoice, companyName: e.target.value })}
                      className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="Vergi Dairesi"
                      value={invoice.taxOffice}
                      onChange={(e) => setInvoice({ ...invoice, taxOffice: e.target.value })}
                      className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Vergi No"
                      value={invoice.taxNumber}
                      onChange={(e) => setInvoice({ ...invoice, taxNumber: e.target.value })}
                      className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </>
                )}
                <input
                  type="text"
                  placeholder="Şehir"
                  value={invoice.city}
                  onChange={(e) => setInvoice({ ...invoice, city: e.target.value })}
                  className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
                <textarea
                  rows={2}
                  placeholder="Fatura Adresi"
                  value={invoice.address}
                  onChange={(e) => setInvoice({ ...invoice, address: e.target.value })}
                  className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:col-span-2"
                />
              </div>
            </div>

            {/* İndirim kodu — yalnızca kart ödemesinde */}
            {!isTransfer && (
              <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
                <h2 className="font-display text-base font-bold text-ink-900">
                  İndirim kodu{" "}
                  <span className="font-sans text-xs font-normal text-ink-400">(varsa)</span>
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
                  <p className="mt-2 text-xs font-medium text-red-600">Kod geçersiz veya süresi dolmuş.</p>
                )}
              </div>
            )}

            {submitError && <p className="text-sm font-medium text-red-600">{submitError}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-brand-600 px-6 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting
                ? isTransfer
                  ? "Sipariş oluşturuluyor..."
                  : "Ödeme başlatılıyor..."
                : isTransfer
                  ? "Dekontu Gönder ve Siparişi Tamamla →"
                  : "Güvenli Ödemeye Geç →"}
            </button>
            <p className="text-center text-[11px] text-ink-400">
              {isTransfer
                ? "Dekontunuz doğrulandıktan sonra siparişiniz onaylanır ve ekip sizi arar."
                : "iyzico altyapısıyla 256-bit SSL şifreli güvenli ödeme · 9'a kadar taksit"}
            </p>
          </form>

          {/* ===== SAĞ: Sipariş özeti ===== */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-lg">
              <h2 className="font-display text-lg font-bold text-ink-900">Sipariş özeti</h2>

              <div className="mt-4 rounded-xl bg-ink-50 p-4">
                <p className="font-display text-sm font-bold text-ink-900">
                  Kurulum + İlk Ay Yönetim Paketi
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">
                  Yetkilendirme, katalog bağlantısı, ölçümleme, kampanya mimarisi, canlıya alma ve
                  ilk ayın tam yönetimi.
                </p>
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-ink-600">
                    Kurulum{marketplaces.length > 1 ? ` (${marketplaces.length} pazaryeri)` : ""}
                  </dt>
                  <dd className="text-right">
                    {quote.listSetupNet > quote.setupNet && (
                      <span className="mr-2 text-xs text-ink-400 line-through">
                        {formatTRY(quote.listSetupNet)}
                      </span>
                    )}
                    <span className="font-semibold text-ink-900">{formatTRY(quote.setupNet)}</span>
                  </dd>
                </div>

                {addManagement && (
                  <div className="flex justify-between text-brand-700">
                    <dt>Devam ayı yönetimi (−%10)</dt>
                    <dd className="font-semibold">+{formatTRY(quote.managementAddon)}</dd>
                  </div>
                )}

                {quote.codeDiscount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <dt>İndirim ({discount?.code})</dt>
                    <dd className="font-semibold">−{formatTRY(quote.codeDiscount)}</dd>
                  </div>
                )}

                {quote.transferDiscount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <dt>Havale indirimi (−%5)</dt>
                    <dd className="font-semibold">−{formatTRY(quote.transferDiscount)}</dd>
                  </div>
                )}

                <div className="flex justify-between border-t border-ink-100 pt-3">
                  <dt className="text-ink-600">Ara toplam</dt>
                  <dd className="font-semibold text-ink-900">{formatTRY(quote.netAfterDiscount)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-600">KDV (%20)</dt>
                  <dd className="font-semibold text-ink-900">{formatTRY(quote.vatAmount)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t-2 border-ink-900 pt-4">
                  <dt className="font-display text-base font-bold text-ink-900">Bugün ödenecek</dt>
                  <dd className="font-display text-2xl font-extrabold text-ink-900">
                    {formatTRY(quote.total)}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 rounded-xl border border-ink-100 bg-ink-50/70 p-4">
                <p className="text-xs font-bold text-ink-700">
                  Devam etmek isterseniz: {formatTRY(quote.managementMonthly)} + KDV / ay
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">
                  Aylık yönetim <strong>isteğe bağlıdır</strong> — taahhüt yok, dilediğiniz ay
                  durdurabilirsiniz. İlk ay zaten pakete dahil.
                </p>
              </div>

              {/* Güvenli ödeme rozetleri */}
              <div className="mt-5 rounded-xl border border-ink-100 bg-ink-50 px-4 py-3">
                <p className="mb-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                  {isTransfer ? "Havale / EFT" : "Güvenli Ödeme"}
                </p>
                <div className="flex items-center justify-center gap-3">
                  {isTransfer ? (
                    <span className="text-xs font-semibold text-ink-600">
                      {BANK_ACCOUNTS.length} banka · IBAN&apos;a havale/EFT · dekont veya hesap ismiyle onay
                    </span>
                  ) : (
                    <>
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
                    </>
                  )}
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
