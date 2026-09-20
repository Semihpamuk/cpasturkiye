#!/usr/bin/env bash
# CPAS Türkiye — rclone "gdrive" remote'unu KENDİ Google OAuth istemcisine geçirir (VPS'te root)
#
# Neden: rclone'un ortak client_id'si 2026 içinde kapanıyor; kapandığında gece
# yedekleri Drive'a gitmez. Google Cloud'da açılan kendi (ücretsiz) istemci bundan etkilenmez.
#
# ÖNCE bilgisayarında, Google Cloud'dan aldığın ID/secret ile yeniden yetki al:
#   rclone authorize "drive" "<setup sırasında Claude'un ürettiği base64 blob>"
#   → çıkan eyJ... metnini kopyala
# SONRA sunucuda:
#   curl -sSL https://raw.githubusercontent.com/Semihpamuk/cpasturkiye/master/scripts/update-gdrive-client.sh -o update-gdrive-client.sh
#   bash update-gdrive-client.sh 'eyJ...'
set -euo pipefail

BLOB="${1:-}"
REMOTE_NAME="gdrive"
DRIVE_FOLDER="cpasturkiye-yedek"

if [[ -z "$BLOB" || "$BLOB" == \{* ]]; then
  echo "Kullanım: bash update-gdrive-client.sh '<rclone authorize çıktısı (eyJ... base64)>'"
  echo "Bu script client_id içeren yeni biçimi bekler; ham JSON değil."
  exit 1
fi

# base64 paket → client_id, client_secret, token (ayrı satırlar)
mapfile -t PARTS < <(python3 - "$BLOB" <<'PY'
import base64, json, sys
raw = sys.argv[1].strip(); raw += "=" * (-len(raw) % 4)
try:
    data = json.loads(base64.b64decode(raw))
except Exception as e:
    sys.exit(f"HATA: paket açılamadı: {e}")
cid, sec, tok = data.get("client_id", ""), data.get("client_secret", ""), data.get("token")
if isinstance(tok, str): tok = json.loads(tok)
if not cid or not sec:
    sys.exit("HATA: pakette client_id/client_secret yok — authorize'ı kendi istemci bilgilerinle çalıştırdın mı?")
if not tok or "access_token" not in tok:
    sys.exit("HATA: pakette token yok.")
print(cid); print(sec); print(json.dumps(tok))
PY
)
CLIENT_ID="${PARTS[0]}"; CLIENT_SECRET="${PARTS[1]}"; TOKEN="${PARTS[2]}"

echo "▶ Eski ayar yedekleniyor"
CONF="$(rclone config file | tail -1)"
cp "$CONF" "$CONF.onceki-$(date '+%Y%m%d-%H%M')"

echo "▶ $REMOTE_NAME remote'u kendi istemciye geçiriliyor (client_id: ${CLIENT_ID:0:12}...)"
rclone config update "$REMOTE_NAME" client_id="$CLIENT_ID" client_secret="$CLIENT_SECRET" token="$TOKEN" scope=drive.file --non-interactive >/dev/null

echo "▶ Bağlantı testi"
echo "istemci testi $(date -Is)" | rclone rcat "$REMOTE_NAME:$DRIVE_FOLDER/.istemci-testi.txt"
rclone deletefile "$REMOTE_NAME:$DRIVE_FOLDER/.istemci-testi.txt"
echo "  ✓ Drive'a yazma/silme kendi istemciyle çalışıyor"

echo "▶ Drive'daki yedekler:"
rclone ls "$REMOTE_NAME:$DRIVE_FOLDER"
echo
echo "✅ Bitti. Artık ortak client_id uyarısı gelmemeli: rclone lsd $REMOTE_NAME: --verbose"
