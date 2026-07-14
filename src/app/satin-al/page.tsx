import { Suspense } from "react";
import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hemen Başla — Kurulum + Yönetim Paketi",
  description:
    "CPAS Türkiye kurulum + ilk ay yönetim paketini güvenli iyzico ödemesiyle satın alın. Ödeme sonrası ekibimiz 24 saat içinde sizi arar, kurulum 7 iş gününde tamamlanır.",
  alternates: { canonical: "/satin-al" },
};

export default function CheckoutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "" },
          { name: "Satın Al", path: "/satin-al" },
        ])}
      />
      <Suspense>
        <CheckoutClient />
      </Suspense>
    </>
  );
}
