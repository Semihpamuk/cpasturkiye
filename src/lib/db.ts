import { promises as fs } from "fs";
import path from "path";

// Basit dosya tabanlı veri katmanı (VPS/Easypanel dağıtımı için yeterli).
// İleride Prisma + PostgreSQL'e geçilecekse bu modülün arayüzü korunabilir.

const DATA_DIR = path.join(process.cwd(), "data");
const RECEIPTS_DIR = path.join(DATA_DIR, "receipts");

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

export type OrderStatus =
  | "new"
  | "contacted"
  | "awaiting_transfer"
  | "paid"
  | "cancelled";

export type PaymentMethod = "card" | "transfer";

export interface Order {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  storeUrl: string;
  /** Müşterinin satış yaptığı pazaryerleri (trendyol/hepsiburada/amazon) */
  marketplaces: string[];
  /** Ödeme yöntemi: kart (iyzico) veya havale/EFT */
  paymentMethod: PaymentMethod;
  installment: "single" | "3" | "6" | "9";
  /** Devam ödemesi (bir sonraki ay yönetim) eklendi mi */
  addManagement: boolean;
  discountCode: string | null;
  /** Kurulum paketi (kurulum + ilk ay yönetim), 2. pazaryeri %50 dahil, KDV hariç net */
  setupNet: number;
  /** Devam edilirse aylık yönetim bedeli (bilgi amaçlı, KDV hariç) */
  managementMonthly: number;
  /** Devam ödemesi eklentisi (%10 indirimli peşin), eklenmediyse 0 */
  managementAddon: number;
  discountAmount: number;
  vatAmount: number;
  total: number;
  status: OrderStatus;
  // Fatura bilgileri
  invoiceType: "individual" | "company";
  identityNo: string;
  companyName: string;
  taxOffice: string;
  taxNumber: string;
  address: string;
  city: string;
  // iyzico ödeme bilgileri (opsiyonel)
  paymentId?: string;
  conversationId?: string;
  // Havale dekontu (opsiyonel) — data/receipts/ altındaki dosya adı
  receiptFile?: string;
  // Dekont yerine: ödeme yapılan hesabın resmi ismi (dosya yüklenmediyse)
  receiptAccountName?: string;
}

export interface PendingOrder {
  conversationId: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  storeUrl: string;
  marketplaces: string[];
  addManagement: boolean;
  discountCode: string | null;
  setupNet: number;
  managementMonthly: number;
  managementAddon: number;
  discountAmount: number;
  vatAmount: number;
  total: number;
  invoiceType: "individual" | "company";
  identityNo: string;
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
  /** Kurulum paketi liste (çapa) fiyatı — üstü çizili gösterim (KDV hariç) */
  listSetupFee: number;
  /** Kurulum paketi kampanyalı fiyatı: kurulum + ilk ay yönetim (KDV hariç) */
  setupFee: number;
  /** Aylık yönetim (devam) bedeli — pazaryeri başına (KDV hariç) */
  managementFee: number;
  /** Kurulumun tamamlandığı ortalama iş günü */
  setupDays: number;
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
    listSetupFee: 39000,
    setupFee: 25000,
    managementFee: 16000,
    setupDays: 7,
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

// --- Havale dekontları (data/receipts/ altında dosya olarak saklanır) ---

export async function saveReceipt(storedName: string, data: Buffer): Promise<void> {
  await fs.mkdir(RECEIPTS_DIR, { recursive: true });
  // path traversal koruması: yalnızca dosya adı kullan.
  await fs.writeFile(path.join(RECEIPTS_DIR, path.basename(storedName)), data);
}

export async function readReceipt(
  storedName: string
): Promise<Buffer | null> {
  try {
    return await fs.readFile(path.join(RECEIPTS_DIR, path.basename(storedName)));
  } catch {
    return null;
  }
}

// --- Bekleyen ödemeler (iyzico callback'ten önce geçici olarak saklanır) ---

// Ödeme yarıda kalan bekleyen siparişler için yaşam süresi (24 saat).
const PENDING_ORDER_TTL_MS = 24 * 60 * 60 * 1000;

export async function savePendingOrder(order: PendingOrder): Promise<void> {
  const orders = await readCollection<PendingOrder>("pending-orders");
  const cutoff = Date.now() - PENDING_ORDER_TTL_MS;
  // Aynı conversationId'yi değiştir ve süresi dolmuş (terk edilmiş) kayıtları temizle.
  const without = orders.filter(
    (o) =>
      o.conversationId !== order.conversationId &&
      new Date(o.createdAt).getTime() >= cutoff
  );
  await writeCollection("pending-orders", [order, ...without]);
}

export async function getPendingOrder(conversationId: string): Promise<PendingOrder | null> {
  const orders = await readCollection<PendingOrder>("pending-orders");
  return orders.find((o) => o.conversationId === conversationId) ?? null;
}

export async function deletePendingOrder(conversationId: string): Promise<void> {
  const orders = await readCollection<PendingOrder>("pending-orders");
  await writeCollection(
    "pending-orders",
    orders.filter((o) => o.conversationId !== conversationId)
  );
}
