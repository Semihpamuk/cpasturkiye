"use client";

import { useEffect, useState } from "react";
import { PRICING, type PricingValues } from "@/lib/site";

export interface PublicSettings {
  pricing: PricingValues;
  references: string[];
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
          setSettings({
            pricing: { ...PRICING, ...data.pricing },
            references: Array.isArray(data.references) ? data.references : [],
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}
