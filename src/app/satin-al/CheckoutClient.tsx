"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  computeOrderQuote,
  formatTRY,
  MARKETPLACES,
  BANK_ACCOUNTS,
  type PaymentMethod,
} from "@/lib/site";
import { useSettings } from "@/lib/useSettings";
import {
  initializeCardPayment,
  submitTransferOrder,
  validateDiscountCode,
  validateTransferInput,
  type AppliedDiscount,
} from "./checkout-api";
import Field from "./CheckoutField";
import SuccessJourney from "./SuccessJourney";
import TransferPending from "./TransferPending";
import {
  trackAddPaymentInfo,
  trackBeginCheckout,
  trackDiscountApplied,
  trackPaymentFailed,
  trackViewCheckout,
  type CheckoutEventInput,
} from "@/lib/analytics";

type InvoiceType = "individual" | "company";
type Step = "details" | "payment" | "done" | "failed" | "transfer_pending";

const MAX_RECEIPT_MB = 10;

/** GA4'e gönderilecek hata sebebi için kabul edilen biçim (iyzico errorCode uyumlu). */
const SAFE_FAILURE_REASON = /^[A-Za-z0-9_-]{1,32}$/;

/**
 * Ödeme dönüşü query'si — sunucu sayfasından prop olarak gelir.
 *
 * Neden useSearchParams DEĞİL: o hook Suspense içinde istemci render'ına
 * düşürüyordu; sunucu HTML'inde form hiç yoktu, form mount olunca footer
 * aşağı kayıp CLS 0,93 üretiyordu (Lighthouse, 2026-09-21). Sunucu sayfası
 * query'yi okuyup geçince form SSR'da basılır, kayma olmaz.
 */
export interface CheckoutQuery {
  payment?: string;
  orderId?: string;
  reason?: string;
}

export default function CheckoutClient({ query }: { query: CheckoutQuery }) {
  const { pricing, loaded: settingsLoaded } = useSettings();

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
  // Mobilde sipariş özeti formun ALTINDA kalıyor; müşteri toplam tutarı formu
  // bitirene kadar görmüyordu. Yapışkan alt şerit tutarı hep gösterir, gönder
  // düğmesi ekrana girince kendini gizler (üst üste binmesin).
  const submitRef = useRef<HTMLButtonElement>(null);
  const [submitInView, setSubmitInView] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // Mesafeli Sözleşmeler Yönetmeliği: sipariş öncesi ön bilgilendirmenin
  // teyidi zorunlu. Onaylanmadan ödeme başlatılmaz (sunucuda da doğrulanır).
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [checkoutFormContent, setCheckoutFormContent] = useState("");
  const iyzFormRef = useRef<HTMLDivElement>(null);

  // URL paramları: ?payment=success|failure → sonuç ekranı
  useEffect(() => {
    const payment = query.payment ?? null;
    const oid = query.orderId ?? null;
    if (payment === "success") {
      // orderId olmayabilir: ödeme alındı ama kayıt adımı hata verdiyse
      // callback ?payment=success&pending=1 ile döner — yine başarı ekranı göster.
      setOrderId(oid ?? "");
      setStep("done");
      // purchase BURADA atılmaz: müşteri sık sık harici kurulum portalına
      // yönlendirildiği için bu ekran güvenilir değil. Sunucudan gönderiliyor
      // (api/payment/callback → sendGaPurchase).
    } else if (payment === "failure" || payment === "error") {
      setStep("failed");
      // `reason` URL'den geliyor: doğrulanmazsa herkes GA4'e keyfi metin sokabilir.
      // Whitelist yerine biçim kontrolü — iyzico errorCode'ları korunsun.
      const rawReason = query.reason ?? payment;
      trackPaymentFailed(
        SAFE_FAILURE_REASON.test(rawReason) ? rawReason : "invalid_reason"
      );
    }
  }, [query.payment, query.orderId, query.reason]);

  useEffect(() => {
    const el = submitRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setSubmitInView(entry.isIntersecting), {
      rootMargin: "0px 0px -72px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [step]);

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

  // GA4 olaylarının paylaştığı sepet özeti.
  const analyticsInput = useMemo<CheckoutEventInput>(
    () => ({
      marketplaces,
      managementAddon: quote.managementAddon,
      total: quote.total,
      discountAmount: quote.discountAmount,
      discountCode: discount?.code ?? null,
    }),
    [
      marketplaces,
      quote.managementAddon,
      quote.total,
      quote.discountAmount,
      discount,
    ]
  );

  // view_item yalnızca ilk görüntülemede atılır; pazaryeri seçimi değiştikçe
  // tekrar gönderilirse funnel'ın ilk adımı şişer.
  //
  // settingsLoaded beklenir: admin panelinden değiştirilmiş fiyatlar /api/settings
  // ile async geliyor, olayı erken atarsak value koddaki eski varsayılanı taşır ve
  // begin_checkout/purchase ile tutmaz.
  const hasTrackedView = useRef(false);
  useEffect(() => {
    if (hasTrackedView.current || !settingsLoaded || step !== "details") return;
    hasTrackedView.current = true;
    trackViewCheckout(analyticsInput);
  }, [settingsLoaded, step, analyticsInput]);

  function toggleMarketplace(key: string) {
    setMarketplaces((current) =>
      current.includes(key) ? current.filter((m) => m !== key) : [...current, key]
    );
  }

  function selectPayment(method: PaymentMethod) {
    setPaymentMethod(method);
    setSubmitError("");
    // Havalede indirim kodu geçersiz — temizle.
    const keepsDiscount = method === "card";
    if (!keepsDiscount) {
      setDiscount(null);
      setCodeInput("");
      setCodeStatus("idle");
    }

    // `quote` bu render'da hâlâ eski yönteme göre hesaplı; olayın tutarı doğru
    // olsun diye seçilen yöntemle yeniden hesaplıyoruz.
    const nextDiscount = keepsDiscount ? discount : null;
    const nextQuote = computeOrderQuote(
      {
        marketplaceCount: marketplaces.length || 1,
        addManagement,
        paymentMethod: method,
        discount: nextDiscount
          ? { type: nextDiscount.type, value: nextDiscount.value }
          : null,
      },
      pricing
    );

    trackAddPaymentInfo(
      {
        marketplaces,
        managementAddon: nextQuote.managementAddon,
        total: nextQuote.total,
        discountAmount: nextQuote.discountAmount,
        discountCode: nextDiscount?.code ?? null,
      },
      method
    );
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

    const result = await validateDiscountCode(codeInput);
    if (!result.ok) {
      setDiscount(null);
      setCodeStatus("invalid");
      return;
    }

    setDiscount(result.discount);
    setCodeStatus("idle");
    trackDiscountApplied(result.discount.code);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (marketplaces.length === 0) {
      setSubmitError("Lütfen en az bir pazaryeri seçin.");
      return;
    }
    if (!termsAccepted) {
      setSubmitError(
        "Devam etmek için Ön Bilgilendirme Formu'nu ve Mesafeli Satış Sözleşmesi'ni onaylayın."
      );
      return;
    }
    // Tüm guard'lardan SONRA: olay yalnızca gerçekten ödemeye geçildiğinde atılmalı,
    // yoksa sözleşmeyi onaylamayan ziyaretçiler funnel'ın ikinci adımını şişirir.
    trackBeginCheckout(analyticsInput);
    if (paymentMethod === "transfer") {
      await submitTransfer();
    } else {
      await startCardPayment();
    }
  }

  async function startCardPayment() {
    setSubmitting(true);
    setSubmitError("");

    const result = await initializeCardPayment({
      ...form,
      marketplaces,
      addManagement,
      discountCode: discount?.code || "",
      invoiceType,
      ...invoice,
      termsAccepted,
    });
    setSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

    setCheckoutFormContent(result.checkoutFormContent);
    setStep("payment");
  }

  async function submitTransfer() {
    const inputError = validateTransferInput(receipt, receiptAccountName, MAX_RECEIPT_MB);
    if (inputError) {
      setSubmitError(inputError);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    const result = await submitTransferOrder(
      {
        ...form,
        marketplaces,
        addManagement,
        invoiceType,
        ...invoice,
        receiptAccountName: receiptAccountName.trim(),
        termsAccepted,
      },
      receipt
    );
    setSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

    setOrderId(result.orderId);
    setStep("transfer_pending");
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
            className="mt-8 inline-block rounded-xl bg-brand-700 px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-800"
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
          <p className="mt-1 text-xs text-ink-500">iyzico altyapısıyla 256-bit SSL şifreli ödeme</p>
        </div>
        <div ref={iyzFormRef} id="iyzipay-checkout-form" className="w-full max-w-lg" />
      </section>
    );
  }

  /* ── Ana form ── */
  const isTransfer = paymentMethod === "transfer";

  return (
    <section className="bg-gradient-to-b from-ink-50 to-paper px-4 py-14 pb-28 sm:px-6 lg:px-8 lg:pb-14">
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
                <span className="font-sans text-xs font-normal text-ink-500">(opsiyonel)</span>
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
                <span className="shrink-0 text-right">
                  <span className="block whitespace-nowrap font-display text-sm font-extrabold text-brand-700">
                    +{formatTRY(quote.managementAddon || Math.round(quote.managementMonthly * 0.9))}
                  </span>
                  <span className="block text-[10px] text-ink-500 line-through">
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
                  <span className="absolute -top-2.5 right-3 rounded-full bg-green-700 px-2.5 py-0.5 text-[11px] font-bold text-white">
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
                    <label htmlFor="receipt-file" className="block text-sm font-semibold text-ink-800">
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
                      id="receipt-file"
                      name="receipt"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,application/pdf"
                      onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
                      className="mt-2 block w-full text-sm text-ink-700 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-700 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-800"
                    />
                    {receipt && (
                      <p className="mt-2 text-xs font-medium text-green-700">
                        ✓ {receipt.name} ({(receipt.size / 1024 / 1024).toFixed(1)} MB)
                      </p>
                    )}

                    {/* VEYA ayıracı */}
                    <div className="my-3 flex items-center gap-3">
                      <span className="h-px flex-1 bg-ink-200" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                        veya
                      </span>
                      <span className="h-px flex-1 bg-ink-200" />
                    </div>

                    <label
                      htmlFor="receipt-account-name"
                      className="block text-sm font-semibold text-ink-800"
                    >
                      Ödeme yapılan hesabın resmi ismi
                    </label>
                    <p className="mt-1 text-xs text-ink-500">
                      Havaleyi/EFT&apos;yi gönderdiğiniz banka hesabının tam resmi adı (ad-soyad veya
                      şirket unvanı). Ödemenizi eşleştirebilmemiz için gereklidir.
                    </p>
                    <input
                      id="receipt-account-name"
                      name="receiptAccountName"
                      type="text"
                      autoComplete="name"
                      placeholder="Örn: Ahmet Yılmaz / Örnek Ltd. Şti."
                      value={receiptAccountName}
                      onChange={(e) => setReceiptAccountName(e.target.value)}
                      className="mt-2 w-full rounded-lg border border-ink-300 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
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
                <Field
                  id="checkout-name"
                  name="name"
                  label="Ad Soyad"
                  required
                  autoComplete="name"
                  placeholder="Ahmet Yılmaz"
                  value={form.name}
                  onChange={(name) => setForm({ ...form, name })}
                />
                <Field
                  id="checkout-phone"
                  name="tel"
                  label="Telefon"
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0532 000 00 00"
                  value={form.phone}
                  onChange={(phone) => setForm({ ...form, phone })}
                />
                <Field
                  id="checkout-email"
                  name="email"
                  label="E-posta"
                  required
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="ornek@magazam.com"
                  value={form.email}
                  onChange={(email) => setForm({ ...form, email })}
                />
                <Field
                  id="checkout-store-url"
                  name="url"
                  label="Mağaza linki (Trendyol/Hepsiburada)"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="https://..."
                  value={form.storeUrl}
                  onChange={(storeUrl) => setForm({ ...form, storeUrl })}
                />
              </div>
            </div>

            {/* 5. Fatura bilgileri */}
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-ink-900">
                5. Fatura bilgileriniz{" "}
                <span className="font-sans text-xs font-normal text-ink-500">(opsiyonel)</span>
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
                  <Field
                    id="invoice-identity"
                    name="identityNo"
                    label="TC Kimlik No"
                    inputMode="numeric"
                    placeholder="11111111111"
                    className="sm:col-span-2"
                    value={invoice.identityNo}
                    onChange={(identityNo) => setInvoice({ ...invoice, identityNo })}
                  />
                ) : (
                  <>
                    <Field
                      id="invoice-company"
                      name="organization"
                      label="Şirket / Ticari Unvan"
                      autoComplete="organization"
                      className="sm:col-span-2"
                      value={invoice.companyName}
                      onChange={(companyName) => setInvoice({ ...invoice, companyName })}
                    />
                    <Field
                      id="invoice-tax-office"
                      name="taxOffice"
                      label="Vergi Dairesi"
                      value={invoice.taxOffice}
                      onChange={(taxOffice) => setInvoice({ ...invoice, taxOffice })}
                    />
                    <Field
                      id="invoice-tax-number"
                      name="taxNumber"
                      label="Vergi No"
                      inputMode="numeric"
                      value={invoice.taxNumber}
                      onChange={(taxNumber) => setInvoice({ ...invoice, taxNumber })}
                    />
                  </>
                )}
                <Field
                  id="invoice-city"
                  name="city"
                  label="Şehir"
                  autoComplete="address-level2"
                  value={invoice.city}
                  onChange={(city) => setInvoice({ ...invoice, city })}
                />
                <Field
                  id="invoice-address"
                  name="street-address"
                  label="Fatura Adresi"
                  multiline
                  autoComplete="street-address"
                  className="sm:col-span-2"
                  value={invoice.address}
                  onChange={(address) => setInvoice({ ...invoice, address })}
                />
              </div>
            </div>

            {/* İndirim kodu — yalnızca kart ödemesinde */}
            {!isTransfer && (
              <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
                <h2 className="font-display text-base font-bold text-ink-900">
                  İndirim kodu{" "}
                  <span className="font-sans text-xs font-normal text-ink-500">(varsa)</span>
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
                      id="discount-code"
                      name="discountCode"
                      type="text"
                      aria-label="İndirim kodu"
                      value={codeInput}
                      onChange={(event) => {
                        setCodeInput(event.target.value.toUpperCase());
                        setCodeStatus("idle");
                      }}
                      placeholder="ÖRN: HOSGELDIN10"
                      className="flex-1 rounded-lg border border-ink-300 px-4 py-2.5 text-sm uppercase tracking-wider text-ink-900 placeholder:normal-case placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
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

            {/* Ön bilgilendirmenin teyidi — Mesafeli Sözleşmeler Yönetmeliği gereği zorunlu */}
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink-200 bg-ink-50 p-4 transition-colors hover:border-brand-300">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand-700"
              />
              <span className="text-xs leading-relaxed text-ink-600">
                <Link
                  href="/on-bilgilendirme-formu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-700 underline"
                >
                  Ön Bilgilendirme Formu
                </Link>
                &apos;nu ve{" "}
                <Link
                  href="/mesafeli-satis-sozlesmesi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-700 underline"
                >
                  Mesafeli Satış Sözleşmesi
                </Link>
                &apos;ni okudum, onaylıyorum.
              </span>
            </label>

            <button
              ref={submitRef}
              type="submit"
              disabled={submitting || !termsAccepted}
              className="w-full rounded-xl bg-brand-700 px-6 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-800 disabled:opacity-60"
            >
              {submitting
                ? isTransfer
                  ? "Sipariş oluşturuluyor..."
                  : "Ödeme başlatılıyor..."
                : isTransfer
                  ? "Dekontu Gönder ve Siparişi Tamamla →"
                  : "Güvenli Ödemeye Geç →"}
            </button>
            <p className="text-center text-[11px] font-semibold text-ink-600">
              Bu buton ödeme yükümlülüğü doğuran bir sipariş oluşturur.
            </p>
            <p className="text-center text-[11px] text-ink-500">
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
                      <span className="mr-2 text-xs text-ink-500 line-through">
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

                <div className="flex justify-between">
                  <dt className="text-ink-600">KDV (%20)</dt>
                  <dd className="font-semibold text-ink-900">
                    +{formatTRY(quote.grossBase - quote.baseNet)}
                  </dd>
                </div>

                <div className="flex justify-between border-t border-ink-100 pt-3">
                  <dt className="text-ink-600">Ara toplam (KDV dahil)</dt>
                  <dd className="font-semibold text-ink-900">{formatTRY(quote.grossBase)}</dd>
                </div>

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
                <p className="mb-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-ink-500">
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

              <p className="mt-4 text-center text-[11px] leading-relaxed text-ink-500">
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

      {/* Mobil yapışkan özet — lg ve üstünde özet zaten yan sütunda sabit */}
      <div
        aria-hidden={submitInView}
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-ink-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur transition-transform duration-300 lg:hidden ${
          submitInView ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">Bugün ödenecek</p>
            <p className="font-display text-xl font-extrabold leading-tight text-ink-900">
              {formatTRY(quote.total)}
              <span className="ml-1 text-xs font-medium text-ink-500">KDV dahil</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => submitRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
            className="shrink-0 rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-800"
          >
            {isTransfer ? "Siparişi tamamla ↓" : "Ödemeye geç ↓"}
          </button>
        </div>
      </div>
    </section>
  );
}
