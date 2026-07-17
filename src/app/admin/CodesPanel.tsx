"use client";

import { useState } from "react";
import { formatTRY } from "@/lib/site";
import { type DiscountCode } from "./adminTypes";

export interface NewCodeInput {
  code: string;
  type: "percent" | "fixed";
  value: string;
  maxUses: string;
  expiresAt: string;
  note: string;
}

interface Props {
  codes: DiscountCode[];
  onCreate: (input: NewCodeInput) => Promise<string | null>;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const EMPTY: NewCodeInput = {
  code: "",
  type: "percent",
  value: "",
  maxUses: "",
  expiresAt: "",
  note: "",
};

export default function CodesPanel({ codes, onCreate, onToggle, onDelete }: Props) {
  const [newCode, setNewCode] = useState<NewCodeInput>(EMPTY);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const err = await onCreate(newCode);
    if (err) {
      setError(err);
      return;
    }
    setNewCode(EMPTY);
  }

  return (
    <div className="mt-6">
      <form onSubmit={submit} className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
        <h2 className="font-display text-sm font-bold text-ink-900">Yeni indirim kodu</h2>
        <p className="mt-1 text-xs text-ink-500">İndirim kodları yalnızca kart ödemesinde geçerlidir (havalede %5 zaten uygulanır).</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <input
            required
            type="text"
            placeholder="KOD (örn: KASIM20)"
            value={newCode.code}
            onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
            className="rounded-lg border border-ink-300 px-3 py-2 text-sm uppercase focus:border-brand-500 focus:outline-none lg:col-span-2"
          />
          <select
            value={newCode.type}
            onChange={(e) => setNewCode({ ...newCode, type: e.target.value as "percent" | "fixed" })}
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
          <button type="submit" className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            Oluştur
          </button>
        </div>
        {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
      </form>

      <div className="mt-6 space-y-3">
        {codes.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-400">Henüz kod oluşturmadın.</p>
        )}
        {codes.map((code) => {
          const isExpired = code.expiresAt && new Date(code.expiresAt) < new Date();
          const isExhausted = code.maxUses !== null && code.usedCount >= code.maxUses;
          return (
            <div
              key={code.id}
              className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4 ${
                code.active && !isExpired && !isExhausted ? "border-ink-200" : "border-ink-100 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center gap-3">
                  <code className="rounded-lg bg-ink-900 px-3 py-1 font-mono text-sm font-bold tracking-wider text-white">
                    {code.code}
                  </code>
                  <span className="font-display text-sm font-bold text-brand-700">
                    {code.type === "percent" ? `%${code.value}` : formatTRY(code.value)} indirim
                  </span>
                  {isExpired && <span className="text-xs font-semibold text-red-500">Süresi doldu</span>}
                  {isExhausted && <span className="text-xs font-semibold text-red-500">Limit doldu</span>}
                </div>
                <p className="mt-1 text-xs text-ink-500">
                  Kullanım: {code.usedCount}
                  {code.maxUses !== null ? ` / ${code.maxUses}` : " (sınırsız)"}
                  {code.expiresAt ? ` · Son: ${new Date(code.expiresAt).toLocaleDateString("tr-TR")}` : ""}
                  {code.note ? ` · ${code.note}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onToggle(code.id)}
                  className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 hover:border-brand-300 hover:text-brand-700"
                >
                  {code.active ? "Pasifleştir" : "Aktifleştir"}
                </button>
                <button
                  onClick={() => onDelete(code.id)}
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
  );
}
