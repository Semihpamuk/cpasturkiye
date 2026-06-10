import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Satın Al",
  description:
    "Jale CPAS platformuna hemen başla: planını seç, peşin fiyatına 3 taksit veya taksit seçenekleriyle öde. İndirim kodun varsa kullan.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
