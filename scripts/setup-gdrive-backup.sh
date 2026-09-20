#!/usr/bin/env bash
# CPAS Türkiye — Google Drive'a otomatik günlük yedeği TEK KOMUTLA kurar (VPS'te root olarak)
#
# Ne yapar:
#   1. rclone yoksa kurar
#   2. "gdrive" adlı Google Drive remote'unu verdiğin token ile oluşturur
#      (drive.file kapsamı: rclone yalnızca kendi yüklediği dosyaları görür,
#       Drive'ının geri kalanına erişemez)
#   3. Drive'da "cpasturkiye-yedek" klasörünü açar ve deneme yüklemesi yapar
#   4. backup.sh'ı /opt/cpasturkiye/ altına koyar, her gece 03:30 için cron yazar
#   5. İlk yedeği hemen alır ve Drive'daki listeyi gösterir
#
# ÖNCE bilgisayarında (Windows PowerShell):
#   winget install Rclone.Rclone
#   rclone authorize "drive" "eyJzY29wZSI6ImRyaXZlLmZpbGUifQ"
#   → tarayıcı açılır, Google hesabına izin ver → terminalde
#     "Paste the following into your remote machine --->" altındaki satırı
#     kopyala ({"access_token":...} JSON'u ya da eyJ... ile başlayan base64
#     paketi — ikisi de kabul edilir).
#
# SONRA sunucuda:
#   curl -sSL https://raw.githubusercontent.com/Semihpamuk/cpasturkiye/master/scripts/setup-gdrive-backup.sh -o setup-gdrive-backup.sh
#   bash setup-gdrive-backup.sh '{"access_token":"...","token_type":"Bearer",...}'
set -euo pipefail

TOKEN="${1:-${RCLONE_TOKEN:-}}"
REMOTE_NAME="gdrive"
DRIVE_FOLDER="cpasturkiye-yedek"
INSTALL_DIR="/opt/cpasturkiye"
CRON_FILE="/etc/cron.d/cpasturkiye-backup"
LOG_FILE="/var/log/cpasturkiye-backup.log"
RAW_BASE="https://raw.githubusercontent.com/Semihpamuk/cpasturkiye/master/scripts"

log() { printf '\n▶ %s\n' "$*"; }

if [[ -z "$TOKEN" ]]; then
  cat <<'USAGE'
Kullanım: bash setup-gdrive-backup.sh '<rclone-authorize-token-json>'

Token'ı almak için kendi bilgisayarında:
  winget install Rclone.Rclone
  rclone authorize "drive" "eyJzY29wZSI6ImRyaXZlLmZpbGUifQ"
ve çıkan {"access_token":...} satırını tek tırnak içinde bu scripte ver.
USAGE
  exit 1
fi

# rclone authorize iki biçimde çıktı verebilir:
#   eski: {"access_token":...}                     → doğrudan token
#   yeni (>=1.64): eyJjbGllbnRf... (base64, padding'siz) → {"client_id":"","client_secret":"","token":{...}}
if [[ "$TOKEN" != \{* ]]; then
  if ! command -v python3 >/dev/null 2>&1; then
    echo "HATA: base64 token'ı açmak için python3 gerekli (apt install python3)."; exit 1
  fi
  TOKEN="$(python3 - "$TOKEN" <<'PY'
import base64, json, sys
raw = sys.argv[1].strip()
raw += "=" * (-len(raw) % 4)
try:
    data = json.loads(base64.b64decode(raw))
except Exception as e:
    sys.exit(f"HATA: token base64/JSON olarak açılamadı: {e}")
tok = data.get("token", data)
if isinstance(tok, str):
    tok = json.loads(tok)
if "access_token" not in tok:
    sys.exit("HATA: paketin içinde access_token yok — rclone authorize çıktısını tamamen kopyaladın mı?")
print(json.dumps(tok))
PY
)"
fi

if [[ "$TOKEN" != \{*access_token* ]]; then
  echo "HATA: token JSON gibi görünmüyor (\"{\"access_token\":...}\" bekleniyor)."; exit 1
fi

if [[ "$(id -u)" -ne 0 ]]; then
  echo "HATA: root olarak çalıştır (sudo bash setup-gdrive-backup.sh ...)."; exit 1
fi

# ── 1. rclone ────────────────────────────────────────────────────────────────
if ! command -v rclone >/dev/null 2>&1; then
  log "rclone kuruluyor"
  curl -fsSL https://rclone.org/install.sh | bash
fi
log "rclone: $(rclone version | head -1)"

# ── 2. Remote ────────────────────────────────────────────────────────────────
log "Google Drive remote'u yazılıyor ($REMOTE_NAME)"
rclone config create "$REMOTE_NAME" drive scope=drive.file token="$TOKEN" --non-interactive >/dev/null
RCLONE_CONF="$(rclone config file | tail -1)"

# ── 3. Klasör + deneme ───────────────────────────────────────────────────────
log "Drive'da $DRIVE_FOLDER klasörü ve deneme yüklemesi"
rclone mkdir "$REMOTE_NAME:$DRIVE_FOLDER"
echo "cpasturkiye yedek testi $(date -Is)" | rclone rcat "$REMOTE_NAME:$DRIVE_FOLDER/.baglanti-testi.txt"
rclone deletefile "$REMOTE_NAME:$DRIVE_FOLDER/.baglanti-testi.txt"
echo "  ✓ Drive'a yazma/silme çalışıyor"

# ── 4. backup.sh + cron ──────────────────────────────────────────────────────
log "backup.sh → $INSTALL_DIR"
mkdir -p "$INSTALL_DIR"
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "$here/backup.sh" ]]; then
  cp "$here/backup.sh" "$INSTALL_DIR/backup.sh"
else
  curl -fsSL "$RAW_BASE/backup.sh" -o "$INSTALL_DIR/backup.sh"
fi
if [[ -f "$here/restore.sh" ]]; then
  cp "$here/restore.sh" "$INSTALL_DIR/restore.sh"
else
  curl -fsSL "$RAW_BASE/restore.sh" -o "$INSTALL_DIR/restore.sh" || true
fi
chmod +x "$INSTALL_DIR"/*.sh

# /etc/cron.d: HOME belirsiz olabilir, bu yüzden rclone config yolunu açıkça veriyoruz.
cat > "$CRON_FILE" <<CRON
# CPAS Türkiye — data/ volume'ünün gece yedeği → Google Drive ($DRIVE_FOLDER)
SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin
RCLONE_CONFIG=$RCLONE_CONF
RCLONE_REMOTE=$REMOTE_NAME:$DRIVE_FOLDER
30 3 * * * root $INSTALL_DIR/backup.sh >> $LOG_FILE 2>&1
CRON
chmod 644 "$CRON_FILE"
echo "  ✓ cron yazıldı: $CRON_FILE (her gece 03:30)"

# ── 5. İlk yedek ─────────────────────────────────────────────────────────────
log "İlk yedek alınıyor"
RCLONE_CONFIG="$RCLONE_CONF" RCLONE_REMOTE="$REMOTE_NAME:$DRIVE_FOLDER" "$INSTALL_DIR/backup.sh" | tee -a "$LOG_FILE"

log "Drive'daki yedekler ($DRIVE_FOLDER):"
rclone ls "$REMOTE_NAME:$DRIVE_FOLDER"

cat <<DONE

✅ Bitti. Her gece 03:30'da yeni yedek Drive'a gider, 30 günden eskiler silinir.
   Log:      tail -n 20 $LOG_FILE
   Elle al:  RCLONE_REMOTE=$REMOTE_NAME:$DRIVE_FOLDER $INSTALL_DIR/backup.sh
   Geri yükle: $INSTALL_DIR/restore.sh <yedek.tar.gz>
DONE
