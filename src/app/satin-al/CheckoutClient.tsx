"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { computeOrderQuote, formatTRY } from "@/lib/site";
import { useSettings } from "@/lib/useSettings";

type InvoiceType = "individual" | "company";
type Billing = "monthly" | "yearly";
type Step = "configure" | "details" | "payment" | "done" | "failed";

interface AppliedDiscount {
  code: string;
  type: "percent" | "fixed";
  value: number;
}

export default function CheckoutClient() {
  const { pricing } = useSettings();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>("configure");
  const [isAgency, setIsAgency] = useState(false);
  const [storeCount, setStoreCount] = useState(1);
  const [billing, setBilling] = useState<Billing>("monthly");
  const [includeSetup, setIncludeSetup] = useState(true);

  const [codeInput, setCodeInput] = useState("");
  const [codeStatus, setCodeStatus] = useState<"idle" | "checking" | "invalid">("idle");
  const [discount, setDiscount] = useState<AppliedDiscount | null>(null);

  const [form, setForm] = useState({ name: "", phone: "", email: "", storeUrl: "" });
  const [invoiceType, setInvoiceType] = useState<InvoiceType>("individual");
  const [invoice, setInvoice] = useState({
    identityNo: "",
    companyName: "",
    taxOffice: "",
    taxNumber: "",
    address: "",
    city: "",
  });

  const [setupOnly, setSetupOnly] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [checkoutFormContent, setCheckoutFormContent] = useState("");
  const iyzFormRef = useRef<HTMLDivElement>(null);

  // Detect URL params: ?type=setup → setup-only mode; ?payment=success|failure → result
  useEffect(() => {
    const type = searchParams.get("type");
    const payment = searchParams.get("payment");
    const oid = searchParams.get("orderId");

    if (type === "setup") {
      setSetupOnly(true);
      setStep("details"); // skip configure step
    }

    if (payment === "success" && oid) {
      setOrderId(oid);
      setStep("done");
    } else if (payment === "failure" || payment === "error") {
      setStep("failed");
    }
  }, [searchParams]);

  // Inject iyzico checkout form scripts into DOM when payment step activates
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
          isAgency,
          storeCount,
          billing,
          includeSetup,
          setupOnly,
          discount: discount ? { type: discount.type, value: discount.value } : null,
        },
        pricing
      ),
    [isAgency, storeCount, billing, discount, includeSetup, setupOnly, pricing]
  );

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
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          isAgency,
          storeCount,
          billing,
          includeSetup,
          setupOnly,
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

  // ── Success ──────────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-4 py-20">
        <div className="max-w-lg text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-ink-900">
            Ödemen alındı!
          </h1>
          <p className="mt-4 leading-relaxed text-ink-600">
            Sipariş numaranız: <strong className="text-ink-900">{orderId}</strong>
          </p>
          <p className="mt-2 leading-relaxed text-ink-600">
            Onay e-postasını kontrol et. Ekibimiz en geç 1 iş günü içinde kurulum
            sürecini başlatmak için seninle iletişime geçecek.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-xl bg-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-700"
          >
            Anasayfaya Dön
          </Link>
        </div>
      </section>
    );
  }

  // ── Failure ──────────────────────────────────────────────────────────
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
            Ödeme işlemi başarısız oldu ya da iptal edildi. Kart bilgilerini kontrol
            edip tekrar deneyebilirsin.
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
              bizimle iletişime geç
            </Link>
          </p>
        </div>
      </section>
    );
  }

  // ── Payment (iyzico modal injected) ──────────────────────────────────
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

  // ── Main form (configure + details) ──────────────────────────────────
  return (
    <section className="bg-gradient-to-b from-brand-50/60 to-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {setupOnly ? "Kurulum Hizmetini Satın Al" : "Hemen başla"}
          </h1>
          <p className="mt-3 text-ink-600">
            {setupOnly
              ? "Trendyol–Meta CPAS bağlantısını uzman ekibimiz kurar. Ortalama 7 iş günü içinde sisteminiz hazır teslim edilir."
              : "Paketini yapılandır ve güvenli ödeme adımına geç. Ödemenin ardından ortalama 7 iş günü içinde sistemin hazır teslim edilir."}
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* ===== LEFT: Configuration ===== */}
          <div className="space-y-8">
            {/* Account type — hidden in setup-only mode */}
            {!setupOnly && <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-ink-900">
                1. Hesap tipi
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAgency(false);
                    setStoreCount(Math.min(storeCount, 6));
                  }}
                  className={`rounded-xl border-2 p-4 text-left transition-colors ${
                    !isAgency
                      ? "border-brand-500 bg-brand-50"
                      : "border-ink-200 hover:border-ink-300"
                  }`}
                >
                  <p className="font-display text-sm font-bold text-ink-900">Satıcıyım</p>
                  <p className="mt-1 text-xs text-ink-500">
                    Kendi Trendyol mağazamı / mağazalarımı yöneteceğim
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAgency(true)}
                  className={`rounded-xl border-2 p-4 text-left transition-colors ${
                    isAgency
                      ? "border-brand-500 bg-brand-50"
                      : "border-ink-200 hover:border-ink-300"
                  }`}
                >
                  <p className="font-display text-sm font-bold text-ink-900">Ajansım</p>
                  <p className="mt-1 text-xs text-ink-500">
                    Müşterilerimin mağazalarını yöneteceğim (white-label)
                  </p>
                </button>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-ink-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-ink-900">Mağaza sayısı</p>
                  <p className="text-xs text-ink-500">
                    {isAgency
                      ? `Mağaza başına ${formatTRY(pricing.agencyPerStore)}/ay`
                      : storeCount <= 1
                        ? `İlk mağaza ${formatTRY(pricing.starter)}/ay`
                        : `${formatTRY(pricing.starter)} + ek mağaza başına ${formatTRY(pricing.extraStore)}/ay`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Mağaza azalt"
                    onClick={() => setStoreCount(Math.max(1, storeCount - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-300 text-lg font-bold text-ink-700 hover:border-brand-400 hover:text-brand-600"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-display text-xl font-bold text-ink-900">
                    {storeCount}
                  </span>
                  <button
                    type="button"
                    aria-label="Mağaza artır"
                    onClick={() => setStoreCount(Math.min(isAgency ? 10 : 6, storeCount + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-300 text-lg font-bold text-ink-700 hover:border-brand-400 hover:text-brand-600"
                  >
                    +
                  </button>
                </div>
              </div>

              {quote.requiresContact && (
                <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  {pricing.agencyContactThreshold}+ mağaza için özel hacim fiyatı
                  sunuyoruz —{" "}
                  <Link href="/iletisim" className="font-bold underline">
                    bizimle iletişime geç
                  </Link>
                  .
                </p>
              )}
            </div>}

            {/* Billing period — hidden in setup-only mode */}
            {!setupOnly && <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-ink-900">
                2. Abonelik dönemi
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setBilling("monthly")}
                  className={`rounded-xl border-2 p-4 text-left transition-colors ${
                    billing === "monthly"
                      ? "border-brand-500 bg-brand-50"
                      : "border-ink-200 hover:border-ink-300"
                  }`}
                >
                  <p className="font-display text-sm font-bold text-ink-900">Aylık</p>
                  <p className="mt-1 text-xs text-ink-500">
                    {formatTRY(quote.monthlySubscription)}/ay — taahhütsüz
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setBilling("yearly")}
                  className={`relative rounded-xl border-2 p-4 text-left transition-colors ${
                    billing === "yearly"
                      ? "border-brand-500 bg-brand-50"
                      : "border-ink-200 hover:border-ink-300"
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 rounded-full bg-green-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                    %20 İNDİRİM
                  </span>
                  <p className="font-display text-sm font-bold text-ink-900">Yıllık</p>
                  <p className="mt-1 text-xs text-ink-500">
                    {formatTRY(Math.round(quote.monthlySubscription * (1 - pricing.yearlyDiscount)))}
                    /ay&apos;a denk gelir — 12 ay peşin
                  </p>
                </button>
              </div>
            </div>}

            {/* Setup service — hidden in setup-only mode (already known) */}
            {!setupOnly && <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-ink-900">
                3. Kurulum hizmeti
              </h2>
              <p className="mt-1 text-xs text-ink-500">
                Trendyol yetkilendirme, Meta Business kurulumu ve CPAS bağlantısı —
                yaklaşık 7 iş günü.{" "}
                <Link href="/kurulum" className="font-semibold text-brand-700 underline">
                  Detaylar
                </Link>
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setIncludeSetup(true)}
                  className={`relative rounded-xl border-2 p-4 text-left transition-colors ${
                    includeSetup
                      ? "border-brand-500 bg-brand-50"
                      : "border-ink-200 hover:border-ink-300"
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 rounded-full bg-brand-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                    ÖNERİLEN
                  </span>
                  <p className="font-display text-sm font-bold text-ink-900">
                    Şimdi siparişe ekle
                  </p>
                  <p className="mt-1 text-xs text-ink-500">
                    {formatTRY(pricing.setupFee)} + KDV — tek ödemede her şey tamam,
                    kurulum sırası hemen ayrılır
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setIncludeSetup(false)}
                  className={`rounded-xl border-2 p-4 text-left transition-colors ${
                    !includeSetup
                      ? "border-brand-500 bg-brand-50"
                      : "border-ink-200 hover:border-ink-300"
                  }`}
                >
                  <p className="font-display text-sm font-bold text-ink-900">
                    Daha sonra ayrıca öde
                  </p>
                  <p className="mt-1 text-xs text-ink-500">
                    Ekibimiz arayıp kurulum planını ve ödemesini ayrıca netleştirir
                  </p>
                </button>
              </div>
            </div>}

            {/* Discount code */}
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-ink-900">
                {setupOnly ? "İndirim kodu" : "4. İndirim kodu"}{" "}
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

            {/* Contact + Invoice form */}
            {step === "details" && (
              <form
                onSubmit={startPayment}
                className="space-y-6 rounded-2xl border-2 border-brand-300 bg-white p-6 shadow-md"
              >
                <div>
                  <h2 className="font-display text-base font-bold text-ink-900">
                    {setupOnly ? "1. İletişim bilgilerin" : "5. İletişim bilgilerin"}
                  </h2>
                  <p className="mt-1 text-xs text-ink-500">
                    Fatura ve kurulum koordinasyonu için gereklidir.
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
                      placeholder="Trendyol mağaza linki"
                      value={form.storeUrl}
                      onChange={(e) => setForm({ ...form, storeUrl: e.target.value })}
                      className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                </div>

                <div className="border-t border-ink-100 pt-6">
                  <h2 className="font-display text-base font-bold text-ink-900">
                    {setupOnly ? "2. Fatura bilgileri" : "6. Fatura bilgileri"}
                  </h2>
                  <p className="mt-1 text-xs text-ink-500">
                    Faturanı doğru kesebilmemiz için gereklidir.
                  </p>

                  <div className="mt-4 flex gap-2">
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

                {submitError && (
                  <p className="text-sm font-medium text-red-600">{submitError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting || quote.requiresContact}
                  className="w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-700 disabled:opacity-60"
                >
                  {submitting ? "Ödeme başlatılıyor..." : "Güvenli Ödemeye Geç →"}
                </button>
                <p className="text-center text-[11px] text-ink-400">
                  iyzico altyapısıyla 256-bit SSL şifreli güvenli ödeme
                </p>
              </form>
            )}
          </div>

          {/* ===== RIGHT: Order summary ===== */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-lg">
              <h2 className="font-display text-lg font-bold text-ink-900">
                Sipariş özeti
              </h2>

              <dl className="mt-5 space-y-3 text-sm">
                {setupOnly ? (
                  <div className="flex justify-between">
                    <dt className="text-ink-600">Kurulum Hizmeti (tek seferlik)</dt>
                    <dd className="font-semibold text-ink-900">
                      {formatTRY(quote.setupNet)}
                    </dd>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <dt className="text-ink-600">
                        Abonelik ({billing === "yearly" ? "yıllık" : "aylık"} ·{" "}
                        {storeCount} mağaza{isAgency ? " · ajans" : ""})
                      </dt>
                      <dd className="font-semibold text-ink-900">
                        {formatTRY(quote.subscriptionNet)}
                      </dd>
                    </div>
                    {includeSetup && (
                      <div className="flex justify-between">
                        <dt className="text-ink-600">Kurulum (tek seferlik)</dt>
                        <dd className="font-semibold text-ink-900">
                          {formatTRY(quote.setupNet)}
                        </dd>
                      </div>
                    )}
                  </>
                )}
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
                    Toplam
                  </dt>
                  <dd className="font-display text-2xl font-extrabold text-ink-900">
                    {formatTRY(quote.total)}
                  </dd>
                </div>
              </dl>

              {setupOnly ? (
                <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-xs font-bold text-green-800">
                    ✓ Trendyol–Meta CPAS kurulum hizmeti
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-green-700">
                    Ödeme sonrası ekibimiz sizinle iletişime geçer; ~7 iş gününde
                    sisteminiz hazır teslim edilir.{" "}
                    <Link href="/kurulum" className="font-semibold underline">
                      Kuruluma neler dahil?
                    </Link>
                  </p>
                </div>
              ) : includeSetup ? (
                <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-xs font-bold text-green-800">
                    ✓ Kurulum hizmeti siparişe dahil
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-green-700">
                    Ödeme sonrası kurulum sıran hemen ayrılır; ~7 iş gününde sistemin
                    hazır teslim edilir.
                  </p>
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4">
                  <div className="flex items-start gap-2.5">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <div>
                      <p className="text-xs font-bold text-amber-900">
                        Kurulum bedeli bu tutara dahil değildir
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-amber-800">
                        Tek seferlik kurulum hizmeti{" "}
                        <strong>{formatTRY(quote.setupNet)} + KDV</strong> olup ayrıca
                        tahsil edilir.{" "}
                        <Link href="/kurulum" className="font-semibold underline">
                          Kuruluma neler dahil?
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* iyzico / kart logoları */}
              <div className="mt-5 rounded-xl border border-ink-100 bg-ink-50 px-4 py-3">
                <p className="mb-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                  Güvenli Ödeme
                </p>
                <div className="flex items-center justify-center gap-3">
                  {/* iyzico rozeti */}
                  <span className="flex items-center gap-1 rounded-md border border-[#1A1A2E]/20 bg-[#1A1A2E] px-2.5 py-1">
                    <span className="text-[11px] font-bold tracking-tight text-white">iyzico</span>
                    <span className="text-[9px] text-blue-300">ile Öde</span>
                  </span>
                  {/* Visa */}
                  <span className="flex h-7 w-12 items-center justify-center rounded-md border border-ink-200 bg-white px-1.5">
                    <span className="font-display text-base font-black italic text-[#1A1F71]">VISA</span>
                  </span>
                  {/* Mastercard */}
                  <span className="flex h-7 w-12 items-center justify-center rounded-md border border-ink-200 bg-white px-1">
                    <span className="flex">
                      <span className="h-5 w-5 rounded-full bg-[#EB001B] opacity-90" />
                      <span className="-ml-2.5 h-5 w-5 rounded-full bg-[#F79E1B] opacity-90" />
                    </span>
                  </span>
                  {/* SSL */}
                  <span className="flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-2 py-1">
                    <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[10px] font-semibold text-green-700">SSL</span>
                  </span>
                </div>
              </div>

              {step === "configure" && !setupOnly && (
                <button
                  type="button"
                  disabled={quote.requiresContact}
                  onClick={() => setStep("details")}
                  className="mt-5 w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-700 disabled:opacity-60"
                >
                  Devam Et →
                </button>
              )}

              <p className="mt-4 text-center text-[11px] leading-relaxed text-ink-400">
                Ödemeyi tamamladıktan sonra sisteme erişimin ve kurulum sıran hemen
                ayrılır.{" "}
                <Link href="/mesafeli-satis-sozlesmesi" className="underline">
                  Mesafeli Satış Sözleşmesi
                </Link>
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-ink-200 bg-ink-50 p-5 text-xs leading-relaxed text-ink-600">
              <p className="font-bold text-ink-900">💬 Önce konuşmak mı istersin?</p>
              <p className="mt-1">
                Mağazanın CPAS&apos;e uygunluğunu ücretsiz değerlendirelim.{" "}
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
