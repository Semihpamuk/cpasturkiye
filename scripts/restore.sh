#!/usr/bin/env bash
# CPAS Türkiye — bir yedeği data/ volume'üne geri yükler (VPS üzerinde çalışır)
#
# Kullanım:
#   ./restore.sh /var/backups/cpasturkiye/cpasturkiye-yedek-2026-09-20-0330.tar.gz
#   DATA_DIR=/etc/easypanel/projects/.../volumes/... ./restore.sh yedek.tar.gz
#
# Panelden indirilen "Yedek indir" dosyası da aynı formatta; scp ile sunucuya
# atıp bu scripte verebilirsin. Mevcut veri üzerine yazmadan önce yanına
# .onceki-<tarih>.tar.gz olarak kopyasını alır.
set -euo pipefail

archive="${1:-}"
DATA_DIR="${DATA_DIR:-}"

if [[ -z "$archive" || ! -f "$archive" ]]; then
  echo "Kullanım: $0 <yedek.tar.gz>"; exit 1
fi

if [[ -z "$DATA_DIR" ]]; then
  for dir in $(find /etc/easypanel/projects -maxdepth 5 -type d -path '*/volumes/*' 2>/dev/null || true); do
    if [[ -f "$dir/orders.json" || -f "$dir/leads.json" || -f "$dir/settings.json" ]]; then
      DATA_DIR="$dir"; break
    fi
  done
fi
if [[ -z "$DATA_DIR" || ! -d "$DATA_DIR" ]]; then
  echo "HATA: data volume bulunamadı; DATA_DIR=... ile ver."; exit 1
fi

tar -tzf "$archive" >/dev/null || { echo "HATA: arşiv bozuk"; exit 1; }

safety="$(dirname "$archive")/onceki-$(date '+%Y-%m-%d-%H%M').tar.gz"
tar -czf "$safety" -C "$DATA_DIR" .
echo "Mevcut veri yedeklendi: $safety"

tar -xzf "$archive" -C "$DATA_DIR"
echo "Geri yüklendi → $DATA_DIR"
echo "Not: uygulama dosyaları her istekte okur, yeniden başlatma gerekmez."
