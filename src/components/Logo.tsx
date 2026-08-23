import Image from "next/image";

interface LogoProps {
  /** Yükseklik sınıfı bekler (ör. "h-7"); genişlik orana göre otomatik. */
  className?: string;
  /** true => açık zemin (yeşil harfler), false => koyu zemin (fildişi harfler) */
  onLight?: boolean;
}

/**
 * "CPAS." wordmark — "Nokta" kimliği, public/brand/ altındaki vektörden.
 * Kompakt kilit (viewBox 1349×377): küçük boyutlarda "TÜRKİYE" mikro-metni
 * okunmadığı için navbar/footer/admin sade "CPAS." kullanır; tam kilitler
 * (tek satır / birincil) büyük yüzeyler için public/brand/ altında durur.
 */
export default function Logo({ className, onLight = true }: LogoProps) {
  const src = onLight
    ? "/brand/cpas-kisa-acik-zemin.svg"
    : "/brand/cpas-kisa-koyu-zemin.svg";

  return (
    <Image
      src={src}
      alt="CPAS Türkiye"
      width={1349}
      height={377}
      priority
      className={`w-auto ${className ?? "h-7"}`}
    />
  );
}
