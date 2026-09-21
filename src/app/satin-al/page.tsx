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

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

// searchParams sunucuda okunur ve prop olarak geçer; böylece form SSR'da
// basılır (bkz. CheckoutClient içindeki CheckoutQuery açıklaması).
export default async function CheckoutPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const query = { payment: first(sp.payment), orderId: first(sp.orderId), reason: first(sp.reason) };
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "" },
          { name: "Satın Al", path: "/satin-al" },
        ])}
      />
      <CheckoutClient query={query} />
    </>
  );
}
