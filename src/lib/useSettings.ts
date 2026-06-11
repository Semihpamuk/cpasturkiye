"use client";

import { useEffect, useState } from "react";
import { PRICING, type PricingValues } from "@/lib/site";

export interface ReferenceItem {
  name: string;
  url: string;
}

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
          const rawRefs: unknown[] = Array.isArray(data.references) ? data.references : [];
          const references: ReferenceItem[] = rawRefs.map((r) =>
            typeof r === "string"
              ? { name: r, url: "" }
              : { name: String((r as ReferenceItem).name ?? ""), url: String((r as ReferenceItem).url ?? "") }
          );
          setSettings({ pricing: { ...PRICING, ...data.pricing }, references });
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return settings;
}
