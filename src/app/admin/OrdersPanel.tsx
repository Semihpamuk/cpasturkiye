"use client";

import { useMemo, useState } from "react";
import { formatTRY } from "@/lib/site";
import {
  type Order,
  type OrderStatus,
  ORDER_STATUS_LABELS,
  PAYMENT_LABELS,
  formatDateTime,
  downloadCsv,
} from "./adminTypes";

interface Props {
  orders: Order[];
  onStatusChange: (id: string, status: OrderStatus) => void;
}

const STATUS_ORDER: OrderStatus[] = [
  "new",
  "contacted",
  "awaiting_transfer",
  "paid",
  "cancelled",
];

export default function OrdersPanel({ orders, onStatusChange }: Props) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "card" | "transfer">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (paymentFilter !== "all" && (o.paymentMethod ?? "card") !== paymentFilter) return false;
      if (!q) return true;
      return [o.name, o.email, o.phone, o.id, o.companyName, o.city]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [orders, query, statusFilter, paymentFilter]);

  function exportCsv() {
    downloadCsv(
      `siparisler-${new Date().toISOString().slice(0, 10)}.csv`,
      filtered.map((o) => ({
        Tarih: formatDateTime(o.createdAt),
        SiparisNo: o.id,
        Ad: o.name,
        Telefon: o.phone,
        Eposta: o.email,
        Durum: ORDER_STATUS_LABELS[o.status].label,
        Odeme: (o.paymentMethod ?? "card") === "transfer" ? "Havale" : "Kart",
        Pazaryerleri: (o.marketplaces ?? []).join(", "),
        DevamAyi: o.addManagement ? "Evet" : "Hayır",
        Toplam: o.total,
        Kod: o.discountCode ?? "",
        Fatura: o.invoiceType === "company" ? o.companyName : o.identityNo,
        Sehir: o.city,
      })),
      [
        { key: "Tarih", label: "Tarih" },
        { key: "SiparisNo", label: "Sipariş No" },
        { key: "Ad", label: "Ad Soyad" },
        { key: "Telefon", label: "Telefon" },
        { key: "Eposta", label: "E-posta" },
        { key: "Durum", label: "Durum" },
        { key: "Odeme", label: "Ödeme" },
        { key: "Pazaryerleri", label: "Pazaryerleri" },
        { key: "DevamAyi", label: "Devam Ayı" },
        { key: "Toplam", label: "Toplam (KDV dahil)" },
        { key: "Kod", label: "İndirim Kodu" },
        { key: "Fatura", label: "Fatura" },
        { key: "Sehir", label: "Şehir" },
      ]
    );
  }

  const awaitingCount = orders.filter((o) => o.status === "awaiting_transfer").length;

  return (
    <div className="mt-6">
      {/* Araç çubuğu */}
      <div className="flex flex-col gap-3 rounded-2xl border border-ink-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ara: ad, e-posta, telefon, sipariş no..."
          className="flex-1 rounded-lg border border-ink-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
          className="rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="all">Tüm durumlar</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s].label}
            </option>
          ))}
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value as "all" | "card" | "transfer")}
          className="rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="all">Tüm ödemeler</option>
          <option value="card">Kart</option>
          <option value="transfer">Havale/EFT</option>
        </select>
        <button
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="rounded-lg border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:opacity-50"
        >
          ↓ CSV ({filtered.length})
        </button>
      </div>

      {awaitingCount > 0 && (
        <p className="mt-3 rounded-lg bg-purple-50 px-4 py-2.5 text-sm font-medium text-purple-800">
          🏦 {awaitingCount} havale siparişi ödeme doğrulaması bekliyor.
        </p>
      )}

      <div className="mt-4 space-y-4">
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-400">
            {orders.length === 0 ? "Henüz sipariş yok." : "Filtreyle eşleşen sipariş yok."}
          </p>
        )}

        {filtered.map((order) => {
          const payment = order.paymentMethod ?? "card";
          const isTransfer = payment === "transfer";
          return (
            <div key={order.id} className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-base font-bold text-ink-900">{order.name}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ORDER_STATUS_LABELS[order.status].cls}`}>
                      {ORDER_STATUS_LABELS[order.status].label}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${PAYMENT_LABELS[payment].cls}`}>
                      {PAYMENT_LABELS[payment].label}
                    </span>
                    {order.addManagement && (
                      <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                        +Devam ayı
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-ink-600">📞 {order.phone} · ✉️ {order.email}</p>
                  {order.storeUrl && (
                    <a href={order.storeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-700 underline">
                      {order.storeUrl}
                    </a>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-extrabold text-ink-900">{formatTRY(order.total)}</p>
                  <p className="text-xs text-ink-500">
                    {order.installment === "single" ? "Tek çekim" : `${order.installment} taksit`} · Kurulum + İlk Ay
                  </p>
                  {(order.managementMonthly ?? 0) > 0 && (
                    <p className="text-[11px] text-ink-500">
                      Devam: {formatTRY(order.managementMonthly ?? 0)}/ay
                    </p>
                  )}
                </div>
              </div>

              {/* Havale dekontu */}
              {isTransfer && (
                <div className="mt-3 flex items-center gap-3 rounded-xl bg-purple-50 p-3 text-xs">
                  {order.receiptFile ? (
                    <a
                      href={`/api/admin/receipt?file=${encodeURIComponent(order.receiptFile)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 font-semibold text-white transition-colors hover:bg-purple-700"
                    >
                      🧾 Dekontu Gör
                    </a>
                  ) : (
                    <span className="text-purple-700">Dekont yüklenmedi.</span>
                  )}
                  {order.status === "awaiting_transfer" && (
                    <span className="text-purple-700">Ödeme geldiyse siparişi &quot;Ödendi&quot; yapın.</span>
                  )}
                </div>
              )}

              {/* Fatura bilgileri */}
              <div className="mt-3 rounded-xl bg-ink-50 p-3 text-xs text-ink-600">
                <span className="font-semibold text-ink-800">
                  {order.invoiceType === "company" ? "🏢 Kurumsal" : "👤 Bireysel"} fatura:
                </span>{" "}
                {order.invoiceType === "company"
                  ? `${order.companyName} · VD: ${order.taxOffice} · VKN: ${order.taxNumber}`
                  : order.identityNo
                    ? `TCKN: ${order.identityNo}`
                    : "TCKN belirtilmedi"}
                {(order.address || order.city) && (
                  <span> · {order.address}{order.city ? `, ${order.city}` : ""}</span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-3">
                <p className="text-xs text-ink-500">
                  {formatDateTime(order.createdAt)}
                  {order.marketplaces && order.marketplaces.length > 0 ? ` · ${order.marketplaces.join(", ")}` : ""}
                  {order.discountCode ? ` · Kod: ${order.discountCode} (−${formatTRY(order.discountAmount)})` : ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_ORDER.filter((s) => s !== order.status).map((status) => (
                    <button
                      key={status}
                      onClick={() => onStatusChange(order.id, status)}
                      className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${
                        status === "paid"
                          ? "border-green-300 text-green-700 hover:bg-green-50"
                          : "border-ink-200 text-ink-600 hover:border-brand-300 hover:text-brand-700"
                      }`}
                    >
                      {ORDER_STATUS_LABELS[status].label} yap
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
