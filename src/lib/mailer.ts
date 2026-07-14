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

export async function sendOrderConfirmation(order: {
  id: string;
  name: string;
  email: string;
  total: number;
  marketplaces: string[];
  managementMonthly: number;
  paymentId?: string;
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
    from: `"${SITE.name}" <${SITE.email}>`,
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
        <p><strong>Sırada ne var?</strong> Ekip arkadaşımız 24 saat içinde sizi arayarak kurulum planınızı netleştirecek. Kurulum ortalama 7 iş günü sürer; 2. aydan itibaren aylık yönetim bedeli ${formatTRY(order.managementMonthly)} + KDV'dir.</p>
        <p>Sorularınız için: <a href="mailto:${SITE.email}">${SITE.email}</a></p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0">
        <p style="color:#9ca3af;font-size:12px">${SITE.company}</p>
      </div>
    `,
  });

  // Sana bildirim
  await transporter.sendMail({
    from: `"${SITE.name}" <${SITE.email}>`,
    to: SITE.email,
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
