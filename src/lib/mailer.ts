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

export async function sendOrderConfirmation(order: {
  id: string;
  name: string;
  email: string;
  total: number;
  marketplaces: string[];
  managementMonthly: number;
  paymentId?: string;
  /** Jale kurulum kayıt linki (varsa e-postaya "Kuruluma Başla" butonu eklenir). */
  setupUrl?: string;
}): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const formatTRY = (amount: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency", currency: "TRY", maximumFractionDigits: 2,
    }).format(amount);

  const planLabel = "Kurulum + İlk Ay Yönetim Paketi";
  const marketplacesLabel =
    order.marketplaces.length > 0 ? order.marketplaces.join(", ") : "Belirtilmedi";
  const totalFormatted = formatTRY(order.total);

  // Müşteriye onay
  await transporter.sendMail({
    from: fromAddress(),
    replyTo: SITE.email,
    to: order.email,
    subject: `Siparişiniz Alındı — ${SITE.name} #${order.id}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#5850EC">Merhaba ${order.name},</h2>
        <p>Siparişiniz başarıyla alındı ve ödemeniz onaylandı.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb"><strong>Sipariş No</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${order.id}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb"><strong>Hizmet</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${planLabel}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb"><strong>Pazaryerleri</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${marketplacesLabel}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb"><strong>Ödenen Tutar</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${totalFormatted} (KDV dahil)</td></tr>
          ${order.paymentId ? `<tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb"><strong>iyzico Ödeme ID</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${order.paymentId}</td></tr>` : ""}
        </table>
        ${order.setupUrl ? `
        <div style="margin:24px 0;padding:20px;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:12px;text-align:center">
          <p style="margin:0 0 12px;font-weight:600;color:#5850EC">Kurulumunuza hemen başlayın</p>
          <a href="${order.setupUrl}" style="display:inline-block;background:#5850EC;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600">Kuruluma Başla</a>
          <p style="margin:12px 0 0;font-size:12px;color:#9ca3af">Bu bağlantı size özeldir, tek kullanımlıktır.</p>
        </div>` : ""}
        <p><strong>Sırada ne var?</strong> ${order.setupUrl ? "Yukarıdaki bağlantıdan panel hesabınızı oluşturup kurulum sürecini takip edebilirsiniz. " : ""}Ekip arkadaşımız 24 saat içinde sizi arayarak kurulum planınızı netleştirecek. Kurulum ortalama 7 iş günü sürer; 2. aydan itibaren aylık yönetim bedeli ${formatTRY(order.managementMonthly)} + KDV'dir.</p>
        <p>Sorularınız için: <a href="mailto:${SITE.email}">${SITE.email}</a></p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0">
        <p style="color:#9ca3af;font-size:12px">${SITE.company}</p>
      </div>
    `,
  });

  // Sana bildirim
  await transporter.sendMail({
    from: fromAddress(),
    to: notifyAddress(),
    subject: `🎉 Yeni Ödeme — ${order.name} — ${totalFormatted}`,
    html: `
      <div style="font-family:sans-serif">
        <h2>Yeni sipariş ve ödeme alındı</h2>
        <p><strong>Müşteri:</strong> ${order.name} (${order.email})</p>
        <p><strong>Sipariş No:</strong> ${order.id}</p>
        <p><strong>Hizmet:</strong> ${planLabel}</p>
        <p><strong>Pazaryerleri:</strong> ${marketplacesLabel}</p>
        <p><strong>Tutar:</strong> ${totalFormatted}</p>
        <p><strong>⚠️ Aksiyon:</strong> Müşteri 24 saat içinde aranmalı — kurulum planı netleştirilecek.</p>
        ${order.paymentId ? `<p><strong>iyzico Ödeme ID:</strong> ${order.paymentId}</p>` : ""}
      </div>
    `,
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
  total: number;
  marketplaces: string[];
  managementMonthly: number;
  receipt?: { filename: string; content: Buffer };
  receiptAccountName?: string;
}): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const formatTRY = (amount: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency", currency: "TRY", maximumFractionDigits: 2,
    }).format(amount);

  const marketplacesLabel =
    order.marketplaces.length > 0 ? order.marketplaces.join(", ") : "Belirtilmedi";
  const totalFormatted = formatTRY(order.total);

  // Müşteriye "dekont alındı" bilgisi
  await transporter.sendMail({
    from: fromAddress(),
    replyTo: SITE.email,
    to: order.email,
    subject: `Dekontunuz Alındı — ${SITE.name} #${order.id}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#5850EC">Merhaba ${order.name},</h2>
        <p>Havale/EFT dekontunuz alındı. Ödemeniz hesabımıza ulaştığı doğrulanınca
        siparişiniz onaylanacak ve ekip arkadaşımız 24 saat içinde (iş günü) sizi arayacak.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb"><strong>Sipariş No</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${order.id}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb"><strong>Pazaryerleri</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${marketplacesLabel}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb"><strong>Havale Tutarı</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${totalFormatted} (KDV dahil, %5 havale indirimi uygulandı)</td></tr>
        </table>
        <p>Sorularınız için: <a href="mailto:${SITE.email}">${SITE.email}</a></p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0">
        <p style="color:#9ca3af;font-size:12px">${SITE.company}</p>
      </div>
    `,
  });

  // Ekibe doğrulama bildirimi + dekont eki
  await transporter.sendMail({
    from: fromAddress(),
    to: notifyAddress(),
    subject: `🏦 Havale Siparişi — DOĞRULA — ${order.name} — ${totalFormatted}`,
    html: `
      <div style="font-family:sans-serif">
        <h2>Havale/EFT siparişi — ödeme doğrulanmayı bekliyor</h2>
        <p><strong>Müşteri:</strong> ${order.name} (${order.email})</p>
        <p><strong>Sipariş No:</strong> ${order.id}</p>
        <p><strong>Pazaryerleri:</strong> ${marketplacesLabel}</p>
        <p><strong>Beklenen Tutar:</strong> ${totalFormatted}</p>
        <p><strong>⚠️ Aksiyon:</strong> Dekontu kontrol et, ödeme geldiyse admin panelinden siparişi "Ödendi" yap.</p>
        ${
          order.receipt
            ? "<p>Dekont ektedir.</p>"
            : order.receiptAccountName
              ? `<p><strong>Dekont yüklenmedi.</strong> Müşterinin bildirdiği ödeme yapılan hesabın resmi ismi: <strong>${order.receiptAccountName}</strong> — hesap hareketleriyle eşleştirerek doğrula.</p>`
              : "<p>Dekont yüklenmedi.</p>"
        }
      </div>
    `,
    attachments: order.receipt
      ? [{ filename: order.receipt.filename, content: order.receipt.content }]
      : undefined,
  });
}
