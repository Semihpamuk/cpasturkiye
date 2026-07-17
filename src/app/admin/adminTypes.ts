export type OrderStatus =
  | "new"
  | "contacted"
  | "awaiting_transfer"
  | "paid"
  | "cancelled";

export type PaymentMethod = "card" | "transfer";

export interface DiscountCode {
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

export interface Order {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  storeUrl: string;
  marketplaces?: string[];
  paymentMethod?: PaymentMethod;
  installment: string;
  addManagement?: boolean;
  discountCode: string | null;
  discountAmount: number;
  setupNet: number;
  managementMonthly?: number;
  managementAddon?: number;
  total: number;
  status: OrderStatus;
  invoiceType: "individual" | "company";
  identityNo: string;
  companyName: string;
  taxOffice: string;
  taxNumber: string;
  address: string;
  city: string;
  receiptFile?: string;
}

export interface Lead {
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

export const ORDER_STATUS_LABELS: Record<OrderStatus, { label: string; cls: string }> = {
  new: { label: "Yeni", cls: "bg-blue-100 text-blue-700" },
  contacted: { label: "Arandı", cls: "bg-amber-100 text-amber-700" },
  awaiting_transfer: { label: "Havale bekliyor", cls: "bg-purple-100 text-purple-700" },
  paid: { label: "Ödendi", cls: "bg-green-100 text-green-700" },
  cancelled: { label: "İptal", cls: "bg-ink-100 text-ink-500" },
};

export const LEAD_STATUS_LABELS: Record<Lead["status"], { label: string; cls: string }> = {
  new: { label: "Yeni", cls: "bg-blue-100 text-blue-700" },
  contacted: { label: "Arandı", cls: "bg-amber-100 text-amber-700" },
  closed: { label: "Kapandı", cls: "bg-ink-100 text-ink-500" },
};

export const PAYMENT_LABELS: Record<PaymentMethod, { label: string; cls: string }> = {
  card: { label: "Kart", cls: "bg-ink-100 text-ink-600" },
  transfer: { label: "Havale/EFT", cls: "bg-teal-100 text-teal-700" },
};

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Basit CSV dışa aktarma — Excel'in Türkçe karakterleri için BOM ekler. */
export function downloadCsv<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  columns: { key: keyof T; label: string }[]
): void {
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = columns.map((c) => escape(c.label)).join(";");
  const body = rows
    .map((r) => columns.map((c) => escape(r[c.key])).join(";"))
    .join("\n");
  const csv = `﻿${head}\n${body}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
