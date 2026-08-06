"use client";

import { useEffect, useState } from "react";
import { PRICING, type PricingValues } from "@/lib/site";
import { normalizeReferences, type ReferenceItem } from "@/lib/references";

export type { ReferenceItem };

export interface PublicSettings {
  pricing: PricingValues;
  references: ReferenceItem[];
  /**
   * /api/settings yanıtı geldi mi (hata alsak da true olur).
   *
   * Analytics olaylarının doğru fiyatı beklemesi için gerekli: admin panelinden
   * fiyat değiştirilmişse, ayarlar gelmeden atılan bir view_item koddaki eski
   * varsayılanı raporlar ve funnel'ın ilk adımı ile purchase arasında kalıcı
   * gelir tutarsızlığı oluşur.
   */
  loaded: boolean;
}

const FALLBACK: PublicSettings = {
  pricing: { ...PRICING },
  references: [],
  loaded: false,
};

// Admin panelinden güncellenen fiyat ve referansları çeker.
// Yüklenene kadar koddaki varsayılan fiyatlar gösterilir.
export function useSettings(): PublicSettings {
  const [settings, setSettings] = useState<PublicSettings>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.pricing) {
          const references = normalizeReferences(data.references);
          setSettings({
            pricing: { ...PRICING, ...data.pricing },
            references,
            loaded: true,
          });
        } else {
          // Ayar çekilemedi: varsayılan fiyatlarla devam et, ama ölçümü bloklama.
          setSettings((current) => ({ ...current, loaded: true }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSettings((current) => ({ ...current, loaded: true }));
        }
      });
    return () => { cancelled = true; };
  }, []);

  return settings;
}
