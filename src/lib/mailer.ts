import nodemailer from "nodemailer";
import { SITE } from "@/lib/site";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    // E-posta ayarları yoksa sessizce geç — ödeme akışını engelleme
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

/**
 * Gönderen adresi: SMTP sağlayıcısı, kimlik doğrulanan hesaptan farklı bir
 * "from" ile göndermeyi genelde reddeder. Bu yüzden from = SMTP_USER (veya
 * açıkça SMTP_FROM). Görünen ad SITE.name olur.
 */
function fromAddress(): string {
  const addr = process.env.SMTP_FROM || process.env.SMTP_USER || SITE.email;
  return `"${SITE.name}" <${addr}>`;
}

/** Yeni sipariş bildirimlerinin gideceği kutu (varsayılan: gönderen hesap). */
function notifyAddress(): string {
  return process.env.ORDER_NOTIFY_EMAIL || process.env.SMTP_USER || SITE.email;
}

/**
 * Müşteriye e-postalarda gösterilen iletişim/yanıt adresi. Varsayılan olarak
 * gönderen hesaba (SMTP_USER) düşer — böylece yanıtlar okunan kutuya gider.
 * CONTACT_EMAIL ile ayrıca ezilebilir.
 */
function contactEmail(): string {
  return process.env.CONTACT_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER || SITE.email;
}

/* ─────────────────────────── E-posta tasarımı ───────────────────────────
 * Tüm e-postalar tek bir markalı iskeletten üretilir (tablo tabanlı, satır içi
 * stiller — Gmail/Apple/Outlook uyumlu). CPAS Türkiye turuncusu ana vurgu.
 * ------------------------------------------------------------------------- */

const BRAND = "#f2630a";
const BRAND_D = "#c2410c";
const INK = "#0f172a";
const TXT = "#334155";
const MUT = "#94a3b8";
const LINE = "#e9eef4";
const SOFT = "#f7f9fc";

const formatTRY = (amount: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(amount);

/** HTML enjeksiyonuna karşı dinamik metinleri kaçır (isim, dekont adı vb.). */
function esc(value: string): string {
  return value.replace(/[&<>"]/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&quot;"
  );
}

interface ShellRow {
  k: string;
  /** Zaten HTML güvenli olmalı — dinamik değerler için esc() kullan. */
  v: string;
  strong?: boolean;
}

interface ShellOptions {
  eyebrow?: string;
  badgeBg: string;
  badgeInk: string;
  badgeText: string;
  greeting: string;
  intro: string;
  rows: ShellRow[];
  cta?: { href: string; label: string };
  steps?: string[];
  note?: string;
  /** Müşteri e-postalarında "Sorularınız için ..." satırı (admin'de kapalı). */
  contactLine?: boolean;
}

function emailShell(o: ShellOptions): string {
  const eyebrow = o.eyebrow ?? "Meta CPAS Yönetimi";

  const rows = o.rows
    .map(
      (r, i) => `
      <tr>
        <td style="padding:13px 0;${i ? `border-top:1px solid ${LINE};` : ""}font:400 14px/1.4 Arial,sans-serif;color:${MUT}">${r.k}</td>
        <td align="right" style="padding:13px 0;${i ? `border-top:1px solid ${LINE};` : ""}font:${r.strong ? "700" : "600"} 14px/1.4 Arial,sans-serif;color:${r.strong ? INK : TXT};font-variant-numeric:tabular-nums">${r.v}</td>
      </tr>`
    )
    .join("");

  const cta = o.cta
    ? `
      <tr><td style="padding:26px 32px 4px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-radius:12px;background:${BRAND}" bgcolor="${BRAND}">
          <a href="${o.cta.href}" style="display:block;text-align:center;padding:15px 24px;font:700 15px/1 Arial,sans-serif;color:#ffffff;text-decoration:none;border-radius:12px">${o.cta.label} &rarr;</a>
        </td></tr></table>
        <p style="margin:10px 2px 0;font:400 12px/1.5 Arial,sans-serif;color:${MUT};text-align:center">Bu bağlantı size özeldir ve tek kullanımlıktır.</p>
      </td></tr>`
    : "";

  const steps = o.steps
    ? `
      <tr><td style="padding:22px 32px 4px">
        <div style="border:1px solid ${LINE};border-radius:14px;padding:18px 20px;background:${SOFT}">
          <p style="margin:0 0 12px;font:700 13px/1 Arial,sans-serif;color:${INK}">Sırada ne var?</p>
          ${o.steps
            .map(
              (s, i) => `
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:${i ? "10px" : "0"} 0 0"><tr>
            <td valign="top" style="width:26px"><div style="width:22px;height:22px;border-radius:50%;background:${BRAND};color:#ffffff;font:700 12px/22px Arial,sans-serif;text-align:center">${i + 1}</div></td>
            <td style="padding-left:12px;font:400 13px/1.5 Arial,sans-serif;color:${TXT}">${s}</td>
          </tr></table>`
            )
            .join("")}
        </div>
      </td></tr>`
    : "";

  const contact =
    (o.contactLine ?? true)
      ? `
        <p style="margin:14px 0 0;font:400 14px/1.6 Arial,sans-serif;color:${TXT}">Sorularınız için:
          <a href="mailto:${contactEmail()}" style="color:${BRAND_D};font-weight:700;text-decoration:none">${contactEmail()}</a>
        </p>`
      : "";

  const note = o.note
    ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:22px 32px 0">
        <p style="margin:0;font:400 14px/1.6 Arial,sans-serif;color:${TXT}">${o.note}</p>${contact}
      </td></tr></table>`
    : contact
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:22px 32px 0">${contact}</td></tr></table>`
      : "";

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f6;margin:0;padding:0">
    <tr><td align="center" style="padding:28px 14px">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">
        <!-- header band -->
        <tr><td style="background:${INK};padding:22px 32px">
          <table role="presentation" width="100%"><tr>
            <td style="font:800 19px/1 Arial,sans-serif;color:#ffffff;letter-spacing:-.01em">CPAS<span style="color:${BRAND}"> · </span>Türkiye</td>
            <td align="right" style="font:700 10px/1 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#7c8aa0">${eyebrow}</td>
          </tr></table>
        </td></tr>
        <tr><td style="height:3px;background:${BRAND};line-height:3px;font-size:0">&nbsp;</td></tr>

        <!-- status + greeting -->
        <tr><td style="padding:30px 32px 0">
          <span style="display:inline-block;padding:6px 12px;border-radius:999px;background:${o.badgeBg};color:${o.badgeInk};font:700 11px/1 Arial,sans-serif;letter-spacing:.03em">${o.badgeText}</span>
          <h1 style="margin:18px 0 0;font:800 22px/1.25 Arial,sans-serif;color:${INK};letter-spacing:-.01em">${o.greeting}</h1>
          <p style="margin:12px 0 0;font:400 15px/1.6 Arial,sans-serif;color:${TXT}">${o.intro}</p>
        </td></tr>

        <!-- detail block -->
        <tr><td style="padding:22px 32px 0">
          <div style="border:1px solid ${LINE};border-radius:14px;padding:6px 18px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
          </div>
        </td></tr>

        ${cta}
        ${steps}
        ${note}

        <!-- footer -->
        <tr><td style="padding:26px 32px 30px">
          <div style="border-top:1px solid ${LINE};padding-top:18px">
            <p style="margin:0;font:700 13px/1.4 Arial,sans-serif;color:${INK}">CPAS Türkiye</p>
            <p style="margin:4px 0 0;font:400 12px/1.5 Arial,sans-serif;color:${MUT}">${SITE.company} · ${SITE.domain}</p>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>`;
}

/* ─────────────────────────────── E-postalar ─────────────────────────────── */

export async function sendOrderConfirmation(order: {
  id: string;
  name: string;
  email: string;
  phone?: string;
  total: number;
  marketplaces: string[];
  managementMonthly: number;
  paymentId?: string;
  /** Jale kurulum kayıt linki (varsa e-postaya "Kuruluma Başla" butonu eklenir). */
  setupUrl?: string;
}): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const firstName = order.name.trim().split(/\s+/)[0] || order.name;
  const marketplacesLabel =
    order.marketplaces.length > 0 ? order.marketplaces.join(", ") : "Belirtilmedi";
  const totalFormatted = formatTRY(order.total);

  // ── Müşteriye onay ──
  const rows: ShellRow[] = [
    { k: "Sipariş No", v: esc(order.id) },
    { k: "Hizmet", v: "Kurulum + İlk Ay Yönetim" },
    { k: "Pazaryerleri", v: esc(marketplacesLabel) },
  ];
  if (order.paymentId) rows.push({ k: "iyzico Ödeme ID", v: esc(order.paymentId) });
  rows.push({ k: "Ödenen Tutar (KDV dahil)", v: totalFormatted, strong: true });

  const steps = order.setupUrl
    ? [
        "Yukarıdaki bağlantıdan panel hesabınızı oluşturun ve kurulum sürecini takip edin.",
        "Ekip arkadaşımız <b>24 saat içinde (iş günü)</b> sizi arayarak hedefleri ve planı netleştirir.",
        "Yetkilendirmelerin ardından ortalama <b>7 iş günü</b> içinde kampanyalarınız yayında olur.",
      ]
    : [
        "Ekip arkadaşımız <b>24 saat içinde (iş günü)</b> sizi arayarak hedefleri ve planı netleştirir.",
        "Yetkilendirmelerin ardından ortalama <b>7 iş günü</b> içinde kampanyalarınız yayında olur.",
      ];

  await transporter.sendMail({
    from: fromAddress(),
    replyTo: contactEmail(),
    to: order.email,
    subject: `Siparişiniz Alındı — ${SITE.name} #${order.id}`,
    html: emailShell({
      badgeBg: "#dcfce7",
      badgeInk: "#15803d",
      badgeText: "✓ ÖDEME ONAYLANDI",
      greeting: `Merhaba ${esc(firstName)}, başlıyoruz!`,
      intro:
        "Siparişiniz başarıyla alındı ve kart ödemeniz onaylandı. Kurulum sürecinizi hemen başlatabilirsiniz.",
      rows,
      cta: order.setupUrl ? { href: order.setupUrl, label: "Kuruluma Başla" } : undefined,
      steps,
      note: `2. aydan itibaren aylık yönetim bedeli <b>${formatTRY(order.managementMonthly)} + KDV</b>'dir — isteğe bağlıdır, taahhüt yok.`,
    }),
  });

  // ── Ekibe bildirim ──
  await transporter.sendMail({
    from: fromAddress(),
    to: notifyAddress(),
    subject: `🎉 Yeni Ödeme — ${order.name} — ${totalFormatted}`,
    html: emailShell({
      eyebrow: "İç Bildirim",
      badgeBg: "#fee2e2",
      badgeInk: "#b91c1c",
      badgeText: "● AKSİYON · 24 SAATTE ARA",
      greeting: "Yeni ödeme alındı",
      intro: "Kart ödemesi onaylandı. Müşteri, kurulum planını netleştirmek için aranmayı bekliyor.",
      rows: [
        { k: "Müşteri", v: esc(order.name), strong: true },
        { k: "Telefon", v: order.phone ? `<a href="tel:${esc(order.phone)}" style="color:${BRAND_D};font-weight:700;text-decoration:none">${esc(order.phone)}</a>` : "—" },
        { k: "E-posta", v: `<a href="mailto:${esc(order.email)}" style="color:${BRAND_D};text-decoration:none">${esc(order.email)}</a>` },
        { k: "Sipariş No", v: esc(order.id) },
        { k: "Pazaryerleri", v: esc(marketplacesLabel) },
        ...(order.paymentId ? [{ k: "iyzico Ödeme ID", v: esc(order.paymentId) }] : []),
        { k: "Tutar", v: totalFormatted, strong: true },
      ],
      note: "<b>Aksiyon:</b> Müşteriyi 24 saat içinde ara, kurulum planını netleştir.",
      contactLine: false,
    }),
  });
}

/**
 * Havale/EFT siparişi: müşteri dekont yükledi, ödeme doğrulanmayı bekliyor.
 * Müşteriye "dekont alındı" bilgisi, ekibe dekont ekli doğrulama bildirimi gider.
 */
export async function sendTransferReceived(order: {
  id: string;
  name: string;
  email: string;
  phone?: string;
  total: number;
  marketplaces: string[];
  managementMonthly: number;
  receipt?: { filename: string; content: Buffer };
  receiptAccountName?: string;
}): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const marketplacesLabel =
    order.marketplaces.length > 0 ? order.marketplaces.join(", ") : "Belirtilmedi";
  const totalFormatted = formatTRY(order.total);

  // ── Müşteriye "dekont alındı" ──
  await transporter.sendMail({
    from: fromAddress(),
    replyTo: contactEmail(),
    to: order.email,
    subject: `Dekontunuz Alındı — ${SITE.name} #${order.id}`,
    html: emailShell({
      badgeBg: "#ffedd5",
      badgeInk: "#c2410c",
      badgeText: "● DEKONT ALINDI · ONAY BEKLİYOR",
      greeting: "Dekontunuz alındı, teşekkürler!",
      intro:
        "Havale/EFT dekontunuz elimize ulaştı. Ödemeniz hesabımıza geçtiği doğrulanınca siparişiniz onaylanır ve ekip arkadaşımız sizi arar.",
      rows: [
        { k: "Sipariş No", v: esc(order.id) },
        { k: "Pazaryerleri", v: esc(marketplacesLabel) },
        { k: "Havale Tutarı (KDV dahil, %5 indirimli)", v: totalFormatted, strong: true },
      ],
      steps: [
        "Ödemenizi doğrularız (genelde aynı iş günü).",
        "Onay e-postanız gönderilir ve kurulum bağlantınız iletilir.",
        "Ekip arkadaşımız <b>24 saat içinde (iş günü)</b> sizi arar, kurulum başlar.",
      ],
      note: "Dekont doğrulanana kadar bir şey yapmanıza gerek yok — süreci biz yürütüyoruz.",
    }),
  });

  // ── Ekibe doğrulama bildirimi + dekont eki ──
  const receiptNote = order.receipt
    ? "<b>Dekont bu e-postaya eklidir.</b> Kontrol edip ödeme geldiyse admin panelinden siparişi “Ödendi” yap."
    : order.receiptAccountName
      ? `<b>Dekont yüklenmedi.</b> Müşterinin bildirdiği ödeme yapılan hesabın resmi ismi: <b>${esc(order.receiptAccountName)}</b> — hesap hareketleriyle eşleştirerek doğrula.`
      : "<b>Dekont yüklenmedi</b> ve hesap ismi bildirilmedi — müşteriyle iletişime geç.";

  await transporter.sendMail({
    from: fromAddress(),
    to: notifyAddress(),
    subject: `🏦 Havale Siparişi — DOĞRULA — ${order.name} — ${totalFormatted}`,
    html: emailShell({
      eyebrow: "İç Bildirim",
      badgeBg: "#ffedd5",
      badgeInk: "#c2410c",
      badgeText: "● AKSİYON · DEKONTU DOĞRULA",
      greeting: "Havale siparişi — doğrulama bekliyor",
      intro: "Yeni havale/EFT siparişi geldi. Ödeme hesaba ulaştıysa admin panelinden onayla.",
      rows: [
        { k: "Müşteri", v: esc(order.name), strong: true },
        { k: "Telefon", v: order.phone ? `<a href="tel:${esc(order.phone)}" style="color:${BRAND_D};font-weight:700;text-decoration:none">${esc(order.phone)}</a>` : "—" },
        { k: "E-posta", v: `<a href="mailto:${esc(order.email)}" style="color:${BRAND_D};text-decoration:none">${esc(order.email)}</a>` },
        { k: "Sipariş No", v: esc(order.id) },
        { k: "Pazaryerleri", v: esc(marketplacesLabel) },
        { k: "Beklenen Tutar", v: totalFormatted, strong: true },
      ],
      note: receiptNote,
      contactLine: false,
    }),
    attachments: order.receipt
      ? [{ filename: order.receipt.filename, content: order.receipt.content }]
      : undefined,
  });
}
