"use client";

import { useEffect, useState } from "react";
import { PRICING, type PricingValues } from "@/lib/site";
import { normalizeReferences, type ReferenceItem } from "@/lib/references";

export type { ReferenceItem };

export interface PublicSettings {
  pricing: PricingValues;
  references: ReferenceItem[];
}

const FALLBACK: PublicSettings = {
  pricing: { ...PRICING },
  references: [],
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
        if (!cancelled && data?.pricing) {
          const references = normalizeReferences(data.references);
          setSettings({ pricing: { ...PRICING, ...data.pricing }, references });
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return settings;
}
