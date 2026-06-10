"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  computeOrderQuote,
  formatTRY,
  PRICING,
} from "@/lib/site";

type InvoiceType = "individual" | "company";

type Billing = "monthly" | "yearly";
type Installment = "single" | "3" | "6" | "9";
type Step = "configure" | "details" | "done";

interface AppliedDiscount {
  code: string;
  type: "percent" | "fixed";
  value: number;
}

const INSTALLMENT_OPTIONS: { id: Installment; label: string; note: string }[] = [
  { id: "single", label: "Tek Çekim", note: "Kredi kartı veya havale/EFT" },
  { id: "3", label: "3 Taksit", note: "Peşin fiyatına — vade farkı yok" },
  { id: "6", label: "6 Taksit", note: "Anlaşmalı kartlarda" },
  { id: "9", label: "9 Taksit", note: "Anlaşmalı kartlarda" },
];

export default function CheckoutClient() {
  const [step, setStep] = useState<Step>("configure");
  const [isAgency, setIsAgency] = useState(false);
  const [storeCount, setStoreCount] = useState(1);
  const [billing, setBilling] = useState<Billing>("monthly");
  const [installment, setInstallment] = useState<Installment>("3");

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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderId, setOrderId] = useState("");

  const quote = useMemo(
    () =>
      computeOrderQuote({
        isAgency,
        storeCount,
        billing,
        includeSetup: false,
        discount: discount ? { type: discount.type, value: discount.value } : null,
      }),
    [isAgency, storeCount, billing, discount]
  );

  const installmentCount = installment === "single" ? 1 : Number(installment);
  const perInstallment = Math.ceil(quote.total / installmentCount);

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

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          isAgency,
          storeCount,
          billing,
          installment,
          discountCode: discount?.code || "",
          invoiceType,
          ...invoice,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Sipariş alınamadı, lütfen tekrar deneyin.");
        return;
      }
      setOrderId(data.orderId);
      setStep("done");
    } catch {
      setSubmitError("Bağlantı hatası — lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  }

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
            Siparişin alındı! 🎉
          </h1>
          <p className="mt-4 leading-relaxed text-ink-600">
            Sipariş numaran: <strong className="text-ink-900">{orderId}</strong>
          </p>
          <p className="mt-2 leading-relaxed text-ink-600">
            Ekibimiz en geç 1 iş günü içinde seni arayacak; ödemeni seçtiğin taksit
            seçeneğiyle güvenle tamamlayıp kurulum sürecini hemen başlatacağız.
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

  return (
    <section className="bg-gradient-to-b from-brand-50/60 to-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Hemen başla
          </h1>
          <p className="mt-3 text-ink-600">
            Paketini yapılandır, ödeme planını seç. Ekibimiz ödemenin ardından 7 iş günü
            içinde sistemini hazır teslim eder.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* ===== SOL: Yapılandırma ===== */}
          <div className="space-y-8">
            {/* Hesap tipi */}
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
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
                      ? `Mağaza başına ${formatTRY(PRICING.agencyPerStore)}/ay`
                      : storeCount <= 1
                        ? `İlk mağaza ${formatTRY(PRICING.starter)}/ay`
                        : `${formatTRY(PRICING.starter)} + ek mağaza başına ${formatTRY(PRICING.extraStore)}/ay`}
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
                  {PRICING.agencyContactThreshold}+ mağaza için özel hacim fiyatı
                  sunuyoruz —{" "}
                  <Link href="/iletisim" className="font-bold underline">
                    bizimle iletişime geç
                  </Link>
                  .
                </p>
              )}
            </div>

            {/* Ödeme dönemi */}
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
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
                    {formatTRY(Math.round(quote.monthlySubscription * (1 - PRICING.yearlyDiscount)))}
                    /ay&apos;a denk gelir — 12 ay peşin
                  </p>
                </button>
              </div>
            </div>

            {/* Taksit */}
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-ink-900">
                3. Ödeme planı
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {INSTALLMENT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setInstallment(option.id)}
                    className={`relative rounded-xl border-2 p-4 text-left transition-colors ${
                      installment === option.id
                        ? "border-brand-500 bg-brand-50"
                        : "border-ink-200 hover:border-ink-300"
                    }`}
                  >
                    {option.id === "3" && (
                      <span className="absolute -top-2.5 right-3 rounded-full bg-brand-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                        EN POPÜLER
                      </span>
                    )}
                    <p className="font-display text-sm font-bold text-ink-900">
                      {option.label}
                    </p>
                    <p className="mt-1 text-xs text-ink-500">{option.note}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* İndirim kodu */}
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-ink-900">
                4. İndirim kodu{" "}
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

            {/* İletişim + Fatura bilgileri */}
            {step === "details" && (
              <form
                onSubmit={submitOrder}
                className="space-y-6 rounded-2xl border-2 border-brand-300 bg-white p-6 shadow-md"
              >
                <div>
                  <h2 className="font-display text-base font-bold text-ink-900">
                    5. İletişim bilgilerin
                  </h2>
                  <p className="mt-1 text-xs text-ink-500">
                    Ödemeni güvenle tamamlamak için ekibimiz seni arayacak.
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
                    6. Fatura bilgileri
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
                  {submitting ? "Gönderiliyor..." : "Siparişi Tamamla"}
                </button>
              </form>
            )}
          </div>

          {/* ===== SAĞ: Sipariş özeti ===== */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-lg">
              <h2 className="font-display text-lg font-bold text-ink-900">
                Sipariş özeti
              </h2>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-600">
                    Abonelik ({billing === "yearly" ? "yıllık" : "aylık"} ·{" "}
                    {storeCount} mağaza{isAgency ? " · ajans" : ""})
                  </dt>
                  <dd className="font-semibold text-ink-900">
                    {formatTRY(quote.subscriptionNet)}
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
                {installmentCount > 1 && (
                  <div className="rounded-xl bg-brand-50 px-4 py-3 text-center">
                    <p className="text-xs text-ink-600">
                      {installment} taksit ile aylık
                    </p>
                    <p className="font-display text-xl font-bold text-brand-700">
                      {formatTRY(perInstallment)} × {installmentCount}
                    </p>
                    {installment === "3" && (
                      <p className="mt-0.5 text-[11px] font-semibold text-green-700">
                        Peşin fiyatına — vade farkı yok
                      </p>
                    )}
                  </div>
                )}
              </dl>

              {/* Kurulum uyarısı — toplama dahil DEĞİL */}
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
                      <strong>{formatTRY(quote.setupNet)} + KDV</strong> olup ayrıca tahsil
                      edilir. Ekibimiz sipariş sonrası kurulum planını ve ödemesini seninle
                      netleştirir.{" "}
                      <Link href="/kurulum" className="font-semibold underline">
                        Kuruluma neler dahil?
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {step === "configure" && (
                <button
                  type="button"
                  disabled={quote.requiresContact}
                  onClick={() => setStep("details")}
                  className="mt-6 w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-700 disabled:opacity-60"
                >
                  Devam Et →
                </button>
              )}

              <p className="mt-4 text-center text-[11px] leading-relaxed text-ink-400">
                Siparişi tamamladığında ekibimiz seni arayarak ödemeni güvenle alır ve
                kurulumu başlatır.{" "}
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
