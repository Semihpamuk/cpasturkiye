"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/* Gözlemci, öğe görüntü alanına GİRMEDEN önce tetiklenir.
 *
 * Eski ayar (threshold 0.15 + rootMargin -40px) animasyonu öğenin %15'i
 * görünür olduktan SONRA başlatıyordu. Hızlı kaydıran kullanıcı geçiş
 * süresi boyunca boş ekran görüyordu; ana sayfada 16 blok bunu kullandığı
 * için arka arkaya boş viewport'lar oluşuyordu.
 *
 * Artık öğe alt kenarın %25 altındayken tetikleniyor — kullanıcı oraya
 * ulaştığında geçiş çoktan bitmiş oluyor. Animasyon kaybolmaz, yalnızca
 * doğru anda çalışır. */
const ROOT_MARGIN = "0px 0px 25% 0px";

/** Kademeli girişlerde son öğe bu süreden fazla gecikmez. */
const MAX_DELAY_MS = 240;

export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // IntersectionObserver yoksa içerik gizli kalmamalı.
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: ROOT_MARGIN }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties = {
    "--reveal-delay": `${Math.min(delay, MAX_DELAY_MS)}ms`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      style={style}
      className={`reveal ${isVisible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
