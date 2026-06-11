import { promises as fs } from "fs";
import path from "path";

// Basit dosya tabanlı veri katmanı (VPS/Easypanel dağıtımı için yeterli).
// İleride Prisma + PostgreSQL'e geçilecekse bu modülün arayüzü korunabilir.

const DATA_DIR = path.join(process.cwd(), "data");

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
  isAgency: boolean;
  storeCount: number;
  billing: "monthly" | "yearly";
  installment: "single" | "3" | "6" | "9";
  discountCode: string | null;
  subscriptionNet: number;
  includeSetup: boolean; // kurulum siparişe dahil mi
  setupNet: number; // kurulum bedeli (dahilse toplama eklenir, değilse ayrıca tahsil)
  discountAmount: number;
  vatAmount: number;
  total: number;
  status: "new" | "contacted" | "paid" | "cancelled";
  // Fatura bilgileri
  invoiceType: "individual" | "company";
  identityNo: string; // TC kimlik no (bireysel)
  companyName: string;
  taxOffice: string;
  taxNumber: string;
  address: string;
  city: string;
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

export interface PricingSettings {
  starter: number;
  extraStore: number;
  agencyPerStore: number;
  agencyContactThreshold: number;
  setupFee: number;
  yearlyDiscount: number; // 0–1 arası (0.2 = %20)
}

export interface ReferenceItem {
  name: string;
  url: string;
}

export interface SiteSettings {
  pricing: PricingSettings;
  references: ReferenceItem[];
}

export const DEFAULT_SETTINGS: SiteSettings = {
  pricing: {
    starter: 5000,
    extraStore: 3000,
    agencyPerStore: 4000,
    agencyContactThreshold: 7,
    setupFee: 25000,
    yearlyDiscount: 0.2,
  },
  references: [
    { name: "Modavera", url: "" },
    { name: "LunaHome Tekstil", url: "" },
    { name: "Trendline Ayakkabı", url: "" },
    { name: "Bella Cosmetics", url: "" },
    { name: "KidsJoy Oyuncak", url: "" },
    { name: "UrbanFit Spor", url: "" },
    { name: "Nordica Living", url: "" },
    { name: "Pearl Aksesuar", url: "" },
  ],
};

async function readCollection<T>(name: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${name}.json`), "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function writeCollection<T>(name: string, items: T[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, `${name}.json`),
    JSON.stringify(items, null, 2),
    "utf-8"
  );
}

// --- Site ayarları (fiyatlar + referanslar) ---

export async function getSettings(): Promise<SiteSettings> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, "settings.json"), "utf-8");
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    const rawRefs = parsed.references;
    const references: ReferenceItem[] = Array.isArray(rawRefs)
      ? rawRefs.map((r) =>
          typeof r === "string"
            ? { name: r, url: "" }
            : { name: String((r as ReferenceItem).name ?? ""), url: String((r as ReferenceItem).url ?? "") }
        )
      : DEFAULT_SETTINGS.references;
    return {
      pricing: { ...DEFAULT_SETTINGS.pricing, ...(parsed.pricing || {}) },
      references,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, "settings.json"),
    JSON.stringify(settings, null, 2),
    "utf-8"
  );
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// --- İndirim kodları ---

export async function getCodes(): Promise<DiscountCode[]> {
  return readCollection<DiscountCode>("codes");
}

export async function saveCodes(codes: DiscountCode[]): Promise<void> {
  await writeCollection("codes", codes);
}

export async function findValidCode(code: string): Promise<DiscountCode | null> {
  const codes = await getCodes();
  const found = codes.find(
    (c) => c.code.toLowerCase() === code.trim().toLowerCase()
  );
  if (!found) return null;
  if (!found.active) return null;
  if (found.expiresAt && new Date(found.expiresAt) < new Date()) return null;
  if (found.maxUses !== null && found.usedCount >= found.maxUses) return null;
  return found;
}

export async function incrementCodeUsage(id: string): Promise<void> {
  const codes = await getCodes();
  const updated = codes.map((c) =>
    c.id === id ? { ...c, usedCount: c.usedCount + 1 } : c
  );
  await saveCodes(updated);
}

// --- Siparişler ---

export async function getOrders(): Promise<Order[]> {
  return readCollection<Order>("orders");
}

export async function addOrder(order: Order): Promise<void> {
  const orders = await getOrders();
  await writeCollection("orders", [order, ...orders]);
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<void> {
  const orders = await getOrders();
  await writeCollection(
    "orders",
    orders.map((o) => (o.id === id ? { ...o, status } : o))
  );
}

// --- Form başvuruları (lead) ---

export async function getLeads(): Promise<Lead[]> {
  return readCollection<Lead>("leads");
}

export async function addLead(lead: Lead): Promise<void> {
  const leads = await getLeads();
  await writeCollection("leads", [lead, ...leads]);
}

export async function updateLeadStatus(
  id: string,
  status: Lead["status"]
): Promise<void> {
  const leads = await getLeads();
  await writeCollection(
    "leads",
    leads.map((l) => (l.id === id ? { ...l, status } : l))
  );
}
