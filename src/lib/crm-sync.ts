import { getLeads, markLeadCrmSynced, type Lead } from "@/lib/db";

/**
 * Form başvurularını SatisCRM'e iletir (POST /api/webhooks/website).
 *
 * Tasarım: lead ÖNCE sitenin kendi diskine yazılır (veri kaybı imkânsız), sonra
 * CRM'e gönderilir. Gönderim başarısızsa sessizce beklemede kalır ve bir SONRAKİ
 * form başvurusunda tekrar denenir — CRM kısa süre kapalıyken gelen lead'ler böyle
 * telafi edilir. CRM tarafı websiteLeadId ile idempotent: tekrar gönderim çift
 * kayıt üretmez (409 yerine "skipped" döner).
 *
 * Env yoksa entegrasyon güvenle pasiftir (SatisCRM'in Meta deseniyle aynı ilke).
 * Aynı sunucuda ayrı app'ler: CRM_WEBHOOK_URL Easypanel iç ağ adresi olabilir.
 */

const TIMEOUT_MS = 5000;
/** Tek seferde en fazla kaç bekleyen lead denensin (bir başvuru isteğini bloklamasın). */
const RETRY_BATCH_LIMIT = 10;

function crmConfig(): { url: string; token: string } | null {
  const url = process.env.CRM_WEBHOOK_URL || "";
  const token = process.env.CRM_WEBHOOK_TOKEN || "";
  if (!url || !token) return null;
  return { url, token };
}

export function isCrmSyncEnabled(): boolean {
  return crmConfig() !== null;
}

/** Tek lead'i CRM'e gönderir; başarıda diskte crmSyncedAt damgalanır. */
export async function syncLeadToCrm(lead: Lead): Promise<boolean> {
  const cfg = crmConfig();
  if (!cfg) return false;

  try {
    const res = await fetch(cfg.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-webhook-token": cfg.token,
      },
      body: JSON.stringify({
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        storeUrl: lead.storeUrl,
        monthlyOrders: lead.monthlyOrders,
        message: lead.message,
        createdAt: lead.createdAt,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    // 400 = kalıcı ret (Zod) — tekrar denemek fayda etmez, sonsuz retry olmasın diye
    // senkronize SAYILIR; detay CRM'in SyncLog'unda. 5xx/401/503 → beklemede kalır.
    if (res.ok || res.status === 400) {
      await markLeadCrmSynced(lead.id);
      if (res.status === 400) {
        console.error(`[crm-sync] lead ${lead.id} CRM tarafından reddedildi (400) — SyncLog'a bakın`);
      }
      return res.ok;
    }
    console.error(`[crm-sync] lead ${lead.id} iletilemedi: HTTP ${res.status}`);
    return false;
  } catch (e) {
    console.error(
      `[crm-sync] lead ${lead.id} iletilemedi: ${e instanceof Error ? e.message : String(e)}`
    );
    return false;
  }
}

/**
 * Bekleyen (crmSyncedAt'siz) lead'leri eskiden yeniye sırayla gönderir.
 * Her yeni başvuruda çağrılır — CRM'in kapalı olduğu aradaki lead'ler kendiliğinden akar.
 */
export async function syncPendingLeadsToCrm(): Promise<void> {
  if (!isCrmSyncEnabled()) return;
  const pending = (await getLeads())
    .filter((l) => !l.crmSyncedAt)
    .slice(0, RETRY_BATCH_LIMIT)
    .reverse(); // liste yeniden-eskiye tutuluyor; CRM'e eskiden yeniye gitsin

  for (const lead of pending) {
    const ok = await syncLeadToCrm(lead);
    if (!ok) break; // CRM ulaşılamazsa kalanları deneme — sonraki başvuru dener
  }
}
