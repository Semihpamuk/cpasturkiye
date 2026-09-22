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

/**
 * TEK paylaşılan IntersectionObserver.
 *
 * Her Reveal kendi gözlemcisini kuruyordu; ana sayfada 16 blok = 16 gözlemci,
 * her biri ayrı ayrı yerleşim (layout) hesabı tetikliyordu. Tarayıcı tek
 * gözlemciyi tek geçişte işler — mobilde ana iş parçacığı maliyeti belirgin
 * düşer (Lighthouse: Style & Layout 1,7 s).
 */
type RevealCallback = () => void;

let sharedObserver: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, RevealCallback>();

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          callbacks.get(entry.target)?.();
          callbacks.delete(entry.target);
          sharedObserver?.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin: ROOT_MARGIN }
    );
  }
  return sharedObserver;
}

export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = getObserver();
    // IntersectionObserver yoksa içerik gizli kalmamalı.
    if (!observer) {
      setIsVisible(true);
      return;
    }

    callbacks.set(element, () => setIsVisible(true));
    observer.observe(element);
    return () => {
      callbacks.delete(element);
      observer.unobserve(element);
    };
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
