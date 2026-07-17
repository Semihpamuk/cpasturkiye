"use client";

import { useMemo, useState } from "react";
import { type Lead, LEAD_STATUS_LABELS, formatDateTime, downloadCsv } from "./adminTypes";

interface Props {
  leads: Lead[];
  onStatusChange: (id: string, status: Lead["status"]) => void;
}

const STATUS_ORDER: Lead["status"][] = ["new", "contacted", "closed"];

export default function LeadsPanel({ leads, onStatusChange }: Props) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Lead["status"] | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (!q) return true;
      return [l.name, l.email, l.phone, l.message]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [leads, query, statusFilter]);

  function exportCsv() {
    downloadCsv(
      `basvurular-${new Date().toISOString().slice(0, 10)}.csv`,
      filtered.map((l) => ({
        Tarih: formatDateTime(l.createdAt),
        Ad: l.name,
        Telefon: l.phone,
        Eposta: l.email,
        Magaza: l.storeUrl,
        AylikSiparis: l.monthlyOrders,
        Durum: LEAD_STATUS_LABELS[l.status].label,
        Mesaj: l.message,
      })),
      [
        { key: "Tarih", label: "Tarih" },
        { key: "Ad", label: "Ad Soyad" },
        { key: "Telefon", label: "Telefon" },
        { key: "Eposta", label: "E-posta" },
        { key: "Magaza", label: "Mağaza" },
        { key: "AylikSiparis", label: "Aylık Sipariş" },
        { key: "Durum", label: "Durum" },
        { key: "Mesaj", label: "Mesaj" },
      ]
    );
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-ink-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ara: ad, e-posta, telefon, mesaj..."
          className="flex-1 rounded-lg border border-ink-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Lead["status"] | "all")}
          className="rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="all">Tüm durumlar</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABELS[s].label}
            </option>
          ))}
        </select>
        <button
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="rounded-lg border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:opacity-50"
        >
          ↓ CSV ({filtered.length})
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-400">
            {leads.length === 0 ? "Henüz form başvurusu yok." : "Filtreyle eşleşen başvuru yok."}
          </p>
        )}
        {filtered.map((lead) => (
          <div key={lead.id} className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-display text-base font-bold text-ink-900">{lead.name}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEAD_STATUS_LABELS[lead.status].cls}`}>
                    {LEAD_STATUS_LABELS[lead.status].label}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-600">
                  📞 {lead.phone} · ✉️ {lead.email}
                  {lead.monthlyOrders ? ` · Sipariş: ${lead.monthlyOrders}` : ""}
                </p>
                {lead.storeUrl && (
                  <a href={lead.storeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-700 underline">
                    {lead.storeUrl}
                  </a>
                )}
                {lead.message && (
                  <p className="mt-2 rounded-lg bg-ink-50 p-3 text-sm text-ink-700">{lead.message}</p>
                )}
              </div>
              <p className="text-xs text-ink-400">{formatDateTime(lead.createdAt)}</p>
            </div>
            <div className="mt-3 flex gap-2 border-t border-ink-100 pt-3">
              {STATUS_ORDER.filter((s) => s !== lead.status).map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(lead.id, status)}
                  className="rounded-lg border border-ink-200 px-3 py-1 text-xs font-semibold text-ink-600 hover:border-brand-300 hover:text-brand-700"
                >
                  {LEAD_STATUS_LABELS[status].label} yap
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
