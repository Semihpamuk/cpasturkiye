"use client";

import { useCallback, useEffect, useState } from "react";
import Logo from "@/components/Logo";
import {
  type DiscountCode,
  type Order,
  type Lead,
  type OrderStatus,
} from "./adminTypes";
import OrdersPanel from "./OrdersPanel";
import LeadsPanel from "./LeadsPanel";
import CodesPanel, { type NewCodeInput } from "./CodesPanel";
import SettingsPanel from "./SettingsPanel";

type Tab = "orders" | "codes" | "leads" | "settings";

export default function AdminClient() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("orders");

  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

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

  const createCode = useCallback(
    async (input: NewCodeInput): Promise<string | null> => {
      const res = await fetch("/api/admin/codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) return data.error || "Kod oluşturulamadı";
      await loadAll();
      return null;
    },
    [loadAll]
  );

  const toggleCode = useCallback(
    async (id: string) => {
      await fetch("/api/admin/codes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await loadAll();
    },
    [loadAll]
  );

  const deleteCode = useCallback(
    async (id: string) => {
      if (!confirm("Bu kodu silmek istediğine emin misin?")) return;
      await fetch(`/api/admin/codes?id=${id}`, { method: "DELETE" });
      await loadAll();
    },
    [loadAll]
  );

  const setOrderStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      await loadAll();
    },
    [loadAll]
  );

  const setLeadStatus = useCallback(
    async (id: string, status: Lead["status"]) => {
      await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      await loadAll();
    },
    [loadAll]
  );

  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50 text-ink-400">
        Yükleniyor...
      </div>
    );
  }

  if (!authed) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-ink-700 bg-ink-800/80 p-8 shadow-2xl backdrop-blur"
        >
          <Logo className="text-2xl" onLight={false} />
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink-400">Yönetim Paneli</p>
          <p className="mt-5 text-sm text-ink-300">Devam etmek için şifreni gir.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin şifresi"
            autoFocus
            className="mt-3 w-full rounded-lg border border-ink-600 bg-ink-900 px-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
          {loginError && <p className="mt-2 text-sm font-medium text-red-400">{loginError}</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
          >
            Giriş Yap
          </button>
        </form>
      </section>
    );
  }

  const newOrders = orders.filter((o) => o.status === "new").length;
  const awaitingTransfer = orders.filter((o) => o.status === "awaiting_transfer").length;
  const STAT_CARDS = [
    { label: "Toplam Sipariş", value: orders.length, accent: "text-ink-900" },
    { label: "Yeni Sipariş", value: newOrders, accent: "text-brand-600" },
    { label: "Havale Bekleyen", value: awaitingTransfer, accent: "text-purple-600" },
    { label: "Form Başvurusu", value: leads.length, accent: "text-ink-900" },
    { label: "Aktif Kod", value: codes.filter((c) => c.active).length, accent: "text-ink-900" },
  ];

  const TABS: [Tab, string][] = [
    ["orders", `Siparişler (${orders.length})`],
    ["codes", `İndirim Kodları (${codes.length})`],
    ["leads", `Form Başvuruları (${leads.length})`],
    ["settings", "⚙ Ayarlar"],
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="sticky top-0 z-10 border-b border-ink-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <Logo className="text-xl" />
            <span className="hidden rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-500 sm:inline">
              Yönetim
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadAll}
              className="rounded-lg border border-ink-200 px-3 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              ↻ Yenile
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-red-300 hover:text-red-600"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {STAT_CARDS.map((card) => (
            <div key={card.label} className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-ink-500">{card.label}</p>
              <p className={`mt-1 font-display text-3xl font-extrabold ${card.accent}`}>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-1 rounded-xl border border-ink-200 bg-white p-1 shadow-sm sm:inline-flex">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors sm:flex-none ${
                tab === id ? "bg-brand-600 text-white shadow-sm" : "text-ink-500 hover:bg-ink-50 hover:text-ink-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "orders" && <OrdersPanel orders={orders} onStatusChange={setOrderStatus} />}
        {tab === "codes" && (
          <CodesPanel codes={codes} onCreate={createCode} onToggle={toggleCode} onDelete={deleteCode} />
        )}
        {tab === "leads" && <LeadsPanel leads={leads} onStatusChange={setLeadStatus} />}
        {tab === "settings" && <SettingsPanel />}
      </section>
    </div>
  );
}
