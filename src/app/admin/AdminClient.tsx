"use client";

import { useCallback, useEffect, useState } from "react";
import { formatTRY } from "@/lib/site";

interface DiscountCode {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  active: boolean;
  note: string;
  createdAt: string;
}

interface Order {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  storeUrl: string;
  isAgency: boolean;
  storeCount: number;
  billing: string;
  installment: string;
  discountCode: string | null;
  discountAmount: number;
  total: number;
  status: "new" | "contacted" | "paid" | "cancelled";
}

interface Lead {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  storeUrl: string;
  monthlyOrders: string;
  message: string;
  status: "new" | "contacted" | "closed";
}

type Tab = "orders" | "codes" | "leads";

const ORDER_STATUS_LABELS: Record<Order["status"], { label: string; cls: string }> = {
  new: { label: "Yeni", cls: "bg-blue-100 text-blue-700" },
  contacted: { label: "Arandı", cls: "bg-amber-100 text-amber-700" },
  paid: { label: "Ödendi", cls: "bg-green-100 text-green-700" },
  cancelled: { label: "İptal", cls: "bg-ink-100 text-ink-500" },
};

const LEAD_STATUS_LABELS: Record<Lead["status"], { label: string; cls: string }> = {
  new: { label: "Yeni", cls: "bg-blue-100 text-blue-700" },
  contacted: { label: "Arandı", cls: "bg-amber-100 text-amber-700" },
  closed: { label: "Kapandı", cls: "bg-ink-100 text-ink-500" },
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminClient() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("orders");

  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  const [newCode, setNewCode] = useState({
    code: "",
    type: "percent" as "percent" | "fixed",
    value: "",
    maxUses: "",
    expiresAt: "",
    note: "",
  });
  const [codeError, setCodeError] = useState("");

  const loadAll = useCallback(async () => {
    const [codesRes, ordersRes, leadsRes] = await Promise.all([
      fetch("/api/admin/codes"),
      fetch("/api/admin/orders"),
      fetch("/api/admin/leads"),
    ]);
    if (codesRes.status === 401) {
      setAuthed(false);
      return;
    }
    setCodes(await codesRes.json());
    setOrders(await ordersRes.json());
    setLeads(await leadsRes.json());
    setAuthed(true);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setPassword("");
      await loadAll();
    } else {
      const data = await res.json();
      setLoginError(data.error || "Giriş başarısız");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  }

  async function createCode(event: React.FormEvent) {
    event.preventDefault();
    setCodeError("");
    const res = await fetch("/api/admin/codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCode),
    });
    const data = await res.json();
    if (!res.ok) {
      setCodeError(data.error || "Kod oluşturulamadı");
      return;
    }
    setNewCode({ code: "", type: "percent", value: "", maxUses: "", expiresAt: "", note: "" });
    await loadAll();
  }

  async function toggleCode(id: string) {
    await fetch("/api/admin/codes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadAll();
  }

  async function deleteCode(id: string) {
    if (!confirm("Bu kodu silmek istediğine emin misin?")) return;
    await fetch(`/api/admin/codes?id=${id}`, { method: "DELETE" });
    await loadAll();
  }

  async function setOrderStatus(id: string, status: Order["status"]) {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await loadAll();
  }

  async function setLeadStatus(id: string, status: Lead["status"]) {
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await loadAll();
  }

  if (authed === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ink-400">
        Yükleniyor...
      </div>
    );
  }

  if (!authed) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-ink-200 bg-white p-8 shadow-lg"
        >
          <h1 className="font-display text-xl font-bold text-ink-900">Yönetim Paneli</h1>
          <p className="mt-1 text-sm text-ink-500">Devam etmek için şifreni gir.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin şifresi"
            className="mt-5 w-full rounded-lg border border-ink-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          {loginError && (
            <p className="mt-2 text-sm font-medium text-red-600">{loginError}</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Giriş Yap
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-bold text-ink-900">
            Yönetim Paneli
          </h1>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-ink-300 px-4 py-2 text-sm font-semibold text-ink-700 hover:border-red-300 hover:text-red-600"
          >
            Çıkış
          </button>
        </div>

        {/* Özet kartları */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-ink-200 bg-white p-4">
            <p className="text-xs text-ink-500">Toplam Sipariş</p>
            <p className="font-display text-2xl font-bold text-ink-900">{orders.length}</p>
          </div>
          <div className="rounded-xl border border-ink-200 bg-white p-4">
            <p className="text-xs text-ink-500">Yeni Sipariş</p>
            <p className="font-display text-2xl font-bold text-brand-600">
              {orders.filter((o) => o.status === "new").length}
            </p>
          </div>
          <div className="rounded-xl border border-ink-200 bg-white p-4">
            <p className="text-xs text-ink-500">Form Başvurusu</p>
            <p className="font-display text-2xl font-bold text-ink-900">{leads.length}</p>
          </div>
          <div className="rounded-xl border border-ink-200 bg-white p-4">
            <p className="text-xs text-ink-500">Aktif Kod</p>
            <p className="font-display text-2xl font-bold text-ink-900">
              {codes.filter((c) => c.active).length}
            </p>
          </div>
        </div>

        {/* Sekmeler */}
        <div className="mt-8 flex gap-2 border-b border-ink-200">
          {(
            [
              ["orders", `Siparişler (${orders.length})`],
              ["codes", `İndirim Kodları (${codes.length})`],
              ["leads", `Form Başvuruları (${leads.length})`],
            ] as [Tab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                tab === id
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-ink-500 hover:text-ink-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ===== SİPARİŞLER ===== */}
        {tab === "orders" && (
          <div className="mt-6 space-y-4">
            {orders.length === 0 && (
              <p className="py-10 text-center text-sm text-ink-400">Henüz sipariş yok.</p>
            )}
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-display text-base font-bold text-ink-900">
                        {order.name}
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ORDER_STATUS_LABELS[order.status].cls}`}
                      >
                        {ORDER_STATUS_LABELS[order.status].label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink-600">
                      📞 {order.phone} · ✉️ {order.email}
                    </p>
                    {order.storeUrl && (
                      <a
                        href={order.storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-700 underline"
                      >
                        {order.storeUrl}
                      </a>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-extrabold text-ink-900">
                      {formatTRY(order.total)}
                    </p>
                    <p className="text-xs text-ink-500">
                      {order.installment === "single"
                        ? "Tek çekim"
                        : `${order.installment} taksit`}{" "}
                      · {order.billing === "yearly" ? "Yıllık" : "Aylık"}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-3">
                  <p className="text-xs text-ink-500">
                    {formatDateTime(order.createdAt)} · {order.storeCount} mağaza
                    {order.isAgency ? " · Ajans" : ""}
                    {order.discountCode
                      ? ` · Kod: ${order.discountCode} (−${formatTRY(order.discountAmount)})`
                      : ""}
                  </p>
                  <div className="flex gap-2">
                    {(Object.keys(ORDER_STATUS_LABELS) as Order["status"][]).map(
                      (status) =>
                        status !== order.status && (
                          <button
                            key={status}
                            onClick={() => setOrderStatus(order.id, status)}
                            className="rounded-lg border border-ink-200 px-3 py-1 text-xs font-semibold text-ink-600 hover:border-brand-300 hover:text-brand-700"
                          >
                            {ORDER_STATUS_LABELS[status].label} yap
                          </button>
                        )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== KODLAR ===== */}
        {tab === "codes" && (
          <div className="mt-6">
            <form
              onSubmit={createCode}
              className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm"
            >
              <h2 className="font-display text-sm font-bold text-ink-900">
                Yeni indirim kodu
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <input
                  required
                  type="text"
                  placeholder="KOD (örn: KASIM20)"
                  value={newCode.code}
                  onChange={(e) =>
                    setNewCode({ ...newCode, code: e.target.value.toUpperCase() })
                  }
                  className="rounded-lg border border-ink-300 px-3 py-2 text-sm uppercase focus:border-brand-500 focus:outline-none lg:col-span-2"
                />
                <select
                  value={newCode.type}
                  onChange={(e) =>
                    setNewCode({ ...newCode, type: e.target.value as "percent" | "fixed" })
                  }
                  className="rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                >
                  <option value="percent">% Yüzde</option>
                  <option value="fixed">₺ Sabit</option>
                </select>
                <input
                  required
                  type="number"
                  min={1}
                  placeholder={newCode.type === "percent" ? "% değer" : "₺ tutar"}
                  value={newCode.value}
                  onChange={(e) => setNewCode({ ...newCode, value: e.target.value })}
                  className="rounded-lg border border-ink-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
                <input
                  type="number"
                  min={1}
                  placeholder="Maks. kullanım"
                  value={newCode.maxUses}
                  onChange={(e) => setNewCode({ ...newCode, maxUses: e.target.value })}
                  className="rounded-lg border border-ink-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
                <input
                  type="date"
                  value={newCode.expiresAt}
                  onChange={(e) => setNewCode({ ...newCode, expiresAt: e.target.value })}
                  className="rounded-lg border border-ink-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div className="mt-3 flex gap-3">
                <input
                  type="text"
                  placeholder="Not (örn: Instagram kampanyası)"
                  value={newCode.note}
                  onChange={(e) => setNewCode({ ...newCode, note: e.target.value })}
                  className="flex-1 rounded-lg border border-ink-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Oluştur
                </button>
              </div>
              {codeError && (
                <p className="mt-2 text-sm font-medium text-red-600">{codeError}</p>
              )}
            </form>

            <div className="mt-6 space-y-3">
              {codes.length === 0 && (
                <p className="py-10 text-center text-sm text-ink-400">
                  Henüz kod oluşturmadın.
                </p>
              )}
              {codes.map((code) => {
                const isExpired =
                  code.expiresAt && new Date(code.expiresAt) < new Date();
                const isExhausted =
                  code.maxUses !== null && code.usedCount >= code.maxUses;
                return (
                  <div
                    key={code.id}
                    className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4 ${
                      code.active && !isExpired && !isExhausted
                        ? "border-ink-200"
                        : "border-ink-100 opacity-60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <code className="rounded-lg bg-ink-900 px-3 py-1 font-mono text-sm font-bold tracking-wider text-white">
                          {code.code}
                        </code>
                        <span className="font-display text-sm font-bold text-brand-700">
                          {code.type === "percent"
                            ? `%${code.value}`
                            : formatTRY(code.value)}{" "}
                          indirim
                        </span>
                        {isExpired && (
                          <span className="text-xs font-semibold text-red-500">
                            Süresi doldu
                          </span>
                        )}
                        {isExhausted && (
                          <span className="text-xs font-semibold text-red-500">
                            Limit doldu
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-ink-500">
                        Kullanım: {code.usedCount}
                        {code.maxUses !== null ? ` / ${code.maxUses}` : " (sınırsız)"}
                        {code.expiresAt
                          ? ` · Son: ${new Date(code.expiresAt).toLocaleDateString("tr-TR")}`
                          : ""}
                        {code.note ? ` · ${code.note}` : ""}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleCode(code.id)}
                        className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 hover:border-brand-300 hover:text-brand-700"
                      >
                        {code.active ? "Pasifleştir" : "Aktifleştir"}
                      </button>
                      <button
                        onClick={() => deleteCode(code.id)}
                        className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-red-500 hover:border-red-300"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== BAŞVURULAR ===== */}
        {tab === "leads" && (
          <div className="mt-6 space-y-4">
            {leads.length === 0 && (
              <p className="py-10 text-center text-sm text-ink-400">
                Henüz form başvurusu yok.
              </p>
            )}
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-display text-base font-bold text-ink-900">
                        {lead.name}
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEAD_STATUS_LABELS[lead.status].cls}`}
                      >
                        {LEAD_STATUS_LABELS[lead.status].label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink-600">
                      📞 {lead.phone} · ✉️ {lead.email}
                      {lead.monthlyOrders ? ` · Sipariş: ${lead.monthlyOrders}` : ""}
                    </p>
                    {lead.storeUrl && (
                      <a
                        href={lead.storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-700 underline"
                      >
                        {lead.storeUrl}
                      </a>
                    )}
                    {lead.message && (
                      <p className="mt-2 rounded-lg bg-ink-50 p-3 text-sm text-ink-700">
                        {lead.message}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-ink-400">{formatDateTime(lead.createdAt)}</p>
                </div>
                <div className="mt-3 flex gap-2 border-t border-ink-100 pt-3">
                  {(Object.keys(LEAD_STATUS_LABELS) as Lead["status"][]).map(
                    (status) =>
                      status !== lead.status && (
                        <button
                          key={status}
                          onClick={() => setLeadStatus(lead.id, status)}
                          className="rounded-lg border border-ink-200 px-3 py-1 text-xs font-semibold text-ink-600 hover:border-brand-300 hover:text-brand-700"
                        >
                          {LEAD_STATUS_LABELS[status].label} yap
                        </button>
                      )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
