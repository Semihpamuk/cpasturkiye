import Image from "next/image";

interface LogoProps {
  /** Yükseklik sınıfı bekler (ör. "h-7"); genişlik orana göre otomatik. */
  className?: string;
  /** true => açık zemin (yeşil harfler), false => koyu zemin (fildişi harfler) */
  onLight?: boolean;
}

/**
 * "CPAS." wordmark — "Nokta" kimliği, public/brand/ altındaki vektörden.
 * Tek satır kilit: CPAS. + sağda TÜRKİYE (viewBox 1901×387).
 */
export default function Logo({ className, onLight = true }: LogoProps) {
  const src = onLight
    ? "/brand/cpas-tek-satir-acik-zemin.svg"
    : "/brand/cpas-tek-satir-koyu-zemin.svg";

  return (
    <Image
      src={src}
      alt="CPAS Türkiye"
      width={1901}
      height={387}
      priority
      className={`w-auto ${className ?? "h-7"}`}
    />
  );
}
