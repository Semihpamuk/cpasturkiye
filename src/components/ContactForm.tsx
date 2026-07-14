"use client";

import { useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const formData = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          storeUrl: formData.get("storeUrl"),
          monthlyOrders: formData.get("monthlyOrders"),
          message: formData.get("message"),
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-ink-900">
          Talebiniz alındı!
        </h3>
        <p className="mt-2 text-sm text-ink-600">
          Ekibimiz en geç 1 iş günü içinde sizi arayacak.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-800">
            Ad Soyad *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-lg border border-ink-300 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="Adınız ve soyadınız"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink-800">
            Telefon *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="w-full rounded-lg border border-ink-300 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="05XX XXX XX XX"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-800">
          E-posta *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-ink-300 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          placeholder="ornek@firma.com"
        />
      </div>

      <div>
        <label htmlFor="storeUrl" className="mb-1.5 block text-sm font-medium text-ink-800">
          Mağaza Linki (Trendyol / Hepsiburada)
        </label>
        <input
          id="storeUrl"
          name="storeUrl"
          type="url"
          className="w-full rounded-lg border border-ink-300 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          placeholder="https://www.trendyol.com/magaza/... veya hepsiburada.com/..."
        />
      </div>

      <div>
        <label htmlFor="monthlyOrders" className="mb-1.5 block text-sm font-medium text-ink-800">
          Aylık Sipariş Adedi
        </label>
        <select
          id="monthlyOrders"
          name="monthlyOrders"
          className="w-full rounded-lg border border-ink-300 bg-white px-4 py-2.5 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          defaultValue=""
        >
          <option value="" disabled>
            Seçiniz
          </option>
          <option value="0-100">0 – 100</option>
          <option value="100-500">100 – 500</option>
          <option value="500-2000">500 – 2.000</option>
          <option value="2000+">2.000+</option>
          <option value="agency">Ajansım, birden fazla mağaza yönetiyorum</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink-800">
          Mesajınız
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full rounded-lg border border-ink-300 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          placeholder="Sorularınızı veya talebinizi yazın..."
        />
      </div>

      {status === "error" && (
        <p className="text-center text-sm font-medium text-red-600">
          Gönderilemedi — lütfen tekrar deneyin.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-700 hover:shadow-lg disabled:opacity-60"
      >
        {status === "submitting" ? "Gönderiliyor..." : "Beni Arayın"}
      </button>

      <p className="text-center text-xs text-ink-400">
        Formu göndererek{" "}
        <a href="/kvkk" className="underline hover:text-brand-600">
          KVKK Aydınlatma Metni
        </a>
        &apos;ni okuduğunuzu kabul etmiş olursunuz.
      </p>
    </form>
  );
}
