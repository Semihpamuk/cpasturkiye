#!/usr/bin/env bash
# CPAS Türkiye — data/ volume'ünün günlük yedeği (VPS üzerinde, konteyner DIŞINDA çalışır)
#
# Ne yapar:
#   1. Easypanel'in /app/data için oluşturduğu volume klasörünü .tar.gz yapar
#   2. Yerelde $BACKUP_DIR altında saklar, $KEEP_DAYS günden eskileri siler
#   3. $RCLONE_REMOTE tanımlıysa arşivi uzak depoya da kopyalar (Drive, S3, B2...)
#
# Kurulum (sunucuda root olarak, bir kez):
#   mkdir -p /opt/cpasturkiye && cp scripts/backup.sh /opt/cpasturkiye/backup.sh
#   chmod +x /opt/cpasturkiye/backup.sh
#   /opt/cpasturkiye/backup.sh            # ilk çalıştırma — volume yolunu bulduğunu doğrula
#   crontab -e  →  şu satırı ekle (her gece 03:30):
#     30 3 * * * /opt/cpasturkiye/backup.sh >> /var/log/cpasturkiye-backup.log 2>&1
#
# Uzak depo (isteğe bağlı ama şiddetle önerilir — sunucu giderse yerel yedek de gider):
#   apt install rclone  →  rclone config  →  bir remote tanımla (ör. "gdrive")
#   sonra cron satırına başına  RCLONE_REMOTE="gdrive:cpasturkiye-yedek"  ekle.
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/cpasturkiye}"
KEEP_DAYS="${KEEP_DAYS:-30}"
RCLONE_REMOTE="${RCLONE_REMOTE:-}"
# Volume yolunu elle vermek istersen: DATA_DIR=/etc/easypanel/projects/<proje>/<servis>/volumes/<isim>
DATA_DIR="${DATA_DIR:-}"

log() { printf '%s %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"; }

# ── Volume klasörünü bul ─────────────────────────────────────────────────────
if [[ -z "$DATA_DIR" ]]; then
  # Easypanel volume'leri /etc/easypanel/projects/<proje>/<servis>/volumes/<isim> altında durur.
  # /app/data'ya bağlı olanı, içinde orders.json/leads.json bulunduran klasörden tanıyoruz.
  candidates=$(find /etc/easypanel/projects -maxdepth 5 -type d -path '*/volumes/*' 2>/dev/null || true)
  for dir in $candidates; do
    if [[ -f "$dir/orders.json" || -f "$dir/leads.json" || -f "$dir/settings.json" ]]; then
      DATA_DIR="$dir"
      break
    fi
  done
fi

if [[ -z "$DATA_DIR" || ! -d "$DATA_DIR" ]]; then
  log "HATA: data volume klasörü bulunamadı. DATA_DIR=... ile elle ver."
  log "İpucu: docker inspect <konteyner> --format '{{json .Mounts}}' ile /app/data kaynağını gör."
  exit 1
fi

# ── Arşivle ──────────────────────────────────────────────────────────────────
mkdir -p "$BACKUP_DIR"
stamp="$(date '+%Y-%m-%d-%H%M')"
archive="$BACKUP_DIR/cpasturkiye-yedek-$stamp.tar.gz"

tar -czf "$archive" -C "$DATA_DIR" .
size="$(du -h "$archive" | cut -f1)"
log "Yedek alındı: $archive ($size) ← $DATA_DIR"

# Arşiv gerçekten açılabiliyor mu? (yarım kalmış/bozuk yedeğe güvenmeyelim)
if ! tar -tzf "$archive" >/dev/null 2>&1; then
  log "HATA: arşiv doğrulanamadı, siliniyor: $archive"
  rm -f "$archive"
  exit 1
fi

# ── Eskileri temizle ─────────────────────────────────────────────────────────
deleted=$(find "$BACKUP_DIR" -name 'cpasturkiye-yedek-*.tar.gz' -mtime +"$KEEP_DAYS" -print -delete | wc -l)
[[ "$deleted" -gt 0 ]] && log "$deleted eski yedek silindi (> $KEEP_DAYS gün)"

# ── Uzak depoya kopyala ──────────────────────────────────────────────────────
if [[ -n "$RCLONE_REMOTE" ]]; then
  if ! command -v rclone >/dev/null 2>&1; then
    log "UYARI: RCLONE_REMOTE tanımlı ama rclone kurulu değil (apt install rclone)"
    exit 1
  fi
  rclone copy "$archive" "$RCLONE_REMOTE" --quiet
  # Uzakta da aynı saklama süresini uygula
  rclone delete "$RCLONE_REMOTE" --min-age "${KEEP_DAYS}d" --include 'cpasturkiye-yedek-*.tar.gz' --quiet || true
  log "Uzak depoya kopyalandı: $RCLONE_REMOTE"
else
  log "NOT: RCLONE_REMOTE tanımlı değil — yedek yalnızca bu sunucuda duruyor."
fi
