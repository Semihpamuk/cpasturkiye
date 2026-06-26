// Canlı istatistik tipleri — hem server (liveStats.ts) hem client (LiveStatsBand)
// tarafından kullanılır. Bu dosya nötr olmalı: "server-only" / "client-only"
// içermez, yan etkisi yoktur.

export interface StatsBucket {
  spend: number;
  sales: number;
  revenue: number;
}

export interface LiveStats {
  today: StatsBucket;
  week: StatsBucket;
  month: StatsBucket;
  updatedAt: string;
}
