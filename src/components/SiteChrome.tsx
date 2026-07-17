"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Admin paneli kendi tam ekran düzenini kullanır — site header/footer gösterilmez.
const BARE_PREFIXES = ["/admin"];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBare = BARE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isBare) {
    return <>{children}</>;
  }

  // Navbar artık "fixed" — ana sayfada koyu hero navbar'ın altına uzanır,
  // diğer sayfalarda içeriğin navbar altında kalmaması için üst boşluk veririz.
  const isHome = pathname === "/";

  return (
    <>
      <Navbar />
      <main className={isHome ? "" : "pt-16"}>{children}</main>
      <Footer />
    </>
  );
}
