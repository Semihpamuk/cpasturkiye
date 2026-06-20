import { Suspense } from "react";
import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Satın Al",
  description:
    "Jale CPAS platformuna hemen başla: planını seç, güvenli iyzico ödeme altyapısıyla kredi kartıyla öde. İndirim kodun varsa kullan.",
  alternates: { canonical: "/satin-al" },
};

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutClient />
    </Suspense>
  );
}
