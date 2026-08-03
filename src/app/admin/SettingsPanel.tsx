"use client";

import { useEffect, useState } from "react";
import { LOGO_ACCEPT, safeLogoSrc } from "@/lib/references";

interface SettingsForm {
  listSetupFee: string;
  setupFee: string;
  managementFee: string;
  setupDays: string;
}

interface RefRow {
  name: string;
  url: string;
  logo: string;
}

const EMPTY_REF: RefRow = { name: "", url: "", logo: "" };

const PRICE_FIELDS: [keyof SettingsForm, string][] = [
  ["listSetupFee", "Kurulum liste (çapa) fiyatı — üstü çizili (₺)"],
  ["setupFee", "Kurulum kampanyalı fiyatı — ilk ay dahil (₺)"],
  ["managementFee", "Aylık yönetim — pazaryeri başına (₺)"],
  ["setupDays", "Kurulum süresi (iş günü)"],
];

export default function SettingsPanel() {
  const [form, setForm] = useState<SettingsForm>({
    listSetupFee: "",
    setupFee: "",
    managementFee: "",
    setupDays: "",
  });
  const [refs, setRefs] = useState<RefRow[]>([]);
  const [status, setStatus] = useState<"loading" | "idle" | "saving" | "saved" | "error">("loading");
  const [uploadingRow, setUploadingRow] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");

  // Logo dosyasını sunucuya yükler ve satırın logo alanını dönen yolla doldurur.
  // Dosya anında diske yazılır; referans satırı ise "Ayarları Kaydet" ile kalıcılaşır.
  async function uploadLogo(index: number, file: File) {
    setUploadError("");
    setUploadingRow(index);
    try {
      const body = new FormData();
      body.append("logo", file);
      const res = await fetch("/api/admin/logo", { method: "POST", body });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.path) {
        setUploadError(data?.error ?? "Logo yüklenemedi");
        return;
      }
      setRefs((rows) => rows.map((r, i) => (i === index ? { ...r, logo: data.path } : r)));
    } catch {
      setUploadError("Logo yüklenemedi, bağlantını kontrol et");
    } finally {
      setUploadingRow(null);
    }
  }

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.pricing) {
          setForm({
            listSetupFee: String(data.pricing.listSetupFee ?? ""),
            setupFee: String(data.pricing.setupFee ?? ""),
            managementFee: String(data.pricing.managementFee ?? ""),
            setupDays: String(data.pricing.setupDays ?? ""),
          });
          const rawRefs: (Partial<RefRow> | string)[] = Array.isArray(data.references) ? data.references : [];
          setRefs(
            rawRefs.map((r) =>
              typeof r === "string"
                ? { ...EMPTY_REF, name: r }
                : {
                    name: String(r.name ?? ""),
                    url: String(r.url ?? ""),
                    logo: String(r.logo ?? ""),
                  }
            )
          );
        }
        setStatus("idle");
      })
      .catch(() => setStatus("error"));
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pricing: {
            listSetupFee: Number(form.listSetupFee),
            setupFee: Number(form.setupFee),
            managementFee: Number(form.managementFee),
            setupDays: Number(form.setupDays),
          },
          references: refs
            .map((r) => ({ name: r.name.trim(), url: r.url.trim(), logo: r.logo.trim() }))
            .filter((r) => r.name.length > 0),
        }),
      });
      setStatus(res.ok ? "saved" : "error");
      if (res.ok) setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
    }
  }

  if (status === "loading") {
    return <p className="mt-10 text-center text-sm text-ink-400">Ayarlar yükleniyor...</p>;
  }

  return (
    <form onSubmit={save} className="mt-6 space-y-6">
      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
        <h2 className="font-display text-base font-bold text-ink-900">💰 Fiyatlandırma</h2>
        <p className="mt-1 text-xs text-ink-500">
          Buradaki değerler anasayfa, fiyatlandırma ve satın alma sayfalarına anında yansır. Tutarlar
          KDV hariç TL&apos;dir. İkinci pazaryeri %50, havale %5 ve devam eklentisi %10 indirimleri
          otomatik hesaplanır.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {PRICE_FIELDS.map(([key, label]) => (
            <label key={key} className="block">
              <span className="mb-1.5 block text-xs font-semibold text-ink-700">{label}</span>
              <input
                required
                type="number"
                min={0}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
        <h2 className="font-display text-base font-bold text-ink-900">🏪 Referans Mağazalar</h2>
        <p className="mt-1 text-xs text-ink-500">
          Anasayfadaki kayan referans barında gösterilir. Link eklersen mağaza adına tıklayanlar
          Trendyol sayfasına yönlendirilir (isteğe bağlı). Logo yüklersen barda isim yerine logo
          çıkar; logo alanı boşsa mağaza adı yazıyla gösterilir. Logoyu &quot;Yükle&quot; ile
          bilgisayarından seçebilir (PNG, JPG, WEBP, SVG — en fazla 2 MB) veya hazır bir görsel
          adresini yapıştırabilirsin.
        </p>

        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-[1fr_1.1fr_1.4fr_auto_auto] gap-2 px-1">
            <span className="text-xs font-semibold text-ink-500">Mağaza adı</span>
            <span className="text-xs font-semibold text-ink-500">Trendyol linki (isteğe bağlı)</span>
            <span className="text-xs font-semibold text-ink-500">Logo (isteğe bağlı)</span>
            <span className="text-xs font-semibold text-ink-500">Önizleme</span>
            <span />
          </div>

          {refs.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_1.1fr_1.4fr_auto_auto] items-center gap-2">
              <input
                type="text"
                placeholder="Mağaza adı"
                value={row.name}
                onChange={(e) => setRefs(refs.map((r, idx) => (idx === i ? { ...r, name: e.target.value } : r)))}
                className="rounded-lg border border-ink-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              <input
                type="url"
                placeholder="https://www.trendyol.com/..."
                value={row.url}
                onChange={(e) => setRefs(refs.map((r, idx) => (idx === i ? { ...r, url: e.target.value } : r)))}
                className="rounded-lg border border-ink-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Yükle veya görsel adresi yapıştır"
                  value={row.logo}
                  onChange={(e) => setRefs(refs.map((r, idx) => (idx === i ? { ...r, logo: e.target.value } : r)))}
                  className="min-w-0 flex-1 rounded-lg border border-ink-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
                <label
                  className={`flex h-9 shrink-0 items-center rounded-lg border border-brand-300 bg-brand-50 px-3 text-xs font-semibold text-brand-700 transition-colors ${
                    uploadingRow === null ? "cursor-pointer hover:border-brand-500 hover:bg-brand-100" : "cursor-wait opacity-60"
                  }`}
                  title="Bilgisayardan logo yükle"
                >
                  {uploadingRow === i ? "Yükleniyor..." : "Yükle"}
                  <input
                    type="file"
                    accept={LOGO_ACCEPT}
                    disabled={uploadingRow !== null}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (file) void uploadLogo(i, file);
                    }}
                  />
                </label>
              </div>
              <span className="flex h-9 w-24 items-center justify-center rounded-lg border border-dashed border-ink-200 bg-ink-50/60 px-1">
                {safeLogoSrc(row.logo) ? (
                  // eslint-disable-next-line @next/next/no-img-element -- serbest domain önizlemesi
                  <img
                    src={safeLogoSrc(row.logo)}
                    alt=""
                    className="max-h-7 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-[10px] text-ink-400">logo yok</span>
                )}
              </span>
              <button
                type="button"
                onClick={() => setRefs(refs.filter((_, idx) => idx !== i))}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 text-ink-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                title="Kaldır"
              >
                ×
              </button>
            </div>
          ))}

          {uploadError && (
            <p className="px-1 text-xs font-semibold text-red-600">{uploadError}</p>
          )}

          <button
            type="button"
            onClick={() => setRefs([...refs, { ...EMPTY_REF }])}
            className="mt-2 flex items-center gap-1.5 rounded-lg border border-dashed border-brand-300 px-4 py-2 text-xs font-semibold text-brand-700 transition-colors hover:border-brand-500 hover:bg-brand-50"
          >
            + Referans Ekle
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-xl bg-brand-700 px-8 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-800 disabled:opacity-60"
        >
          {status === "saving" ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </button>
        {status === "saved" && <span className="text-sm font-semibold text-green-600">✓ Kaydedildi — site anında güncellendi</span>}
        {status === "error" && <span className="text-sm font-semibold text-red-600">Kaydedilemedi, tekrar dene</span>}
      </div>
    </form>
  );
}
