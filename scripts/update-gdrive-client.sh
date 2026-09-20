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
# rclone authorize bazı sürümlerde pakete client_id/secret'ı KOYMUYOR; o yüzden
# 2. ve 3. argüman olarak da verilebilir (pakettekiler varsa onlar öncelikli).
ARG_CLIENT_ID="${2:-${CLIENT_ID:-}}"
ARG_CLIENT_SECRET="${3:-${CLIENT_SECRET:-}}"
REMOTE_NAME="gdrive"
DRIVE_FOLDER="cpasturkiye-yedek"

if [[ -z "$BLOB" || "$BLOB" == \{* ]]; then
  echo "Kullanım: bash update-gdrive-client.sh '<rclone authorize çıktısı (eyJ...)>' [client_id] [client_secret]"
  echo "Bu script client_id içeren yeni biçimi bekler; ham JSON değil."
  exit 1
fi

# base64 paket → client_id, client_secret, token (ayrı satırlar)
PARSED="$(python3 - "$BLOB" "$ARG_CLIENT_ID" "$ARG_CLIENT_SECRET" <<'PY'
import base64, json, sys
raw, arg_id, arg_sec = sys.argv[1].strip(), sys.argv[2], sys.argv[3]
raw += "=" * (-len(raw) % 4)
try:
    data = json.loads(base64.b64decode(raw))
except Exception as e:
    sys.exit(f"HATA: paket açılamadı: {e}")
tok = data.get("token")
if isinstance(tok, str): tok = json.loads(tok)
if not tok or "access_token" not in tok:
    sys.exit("HATA: pakette token yok (anahtarlar: %s)." % ", ".join(data.keys()))
cid = data.get("client_id") or arg_id
sec = data.get("client_secret") or arg_sec
if not cid or not sec:
    sys.exit("HATA: client_id/client_secret ne pakette ne argümanda var. "
             "Kullanım: bash update-gdrive-client.sh '<eyJ...>' '<client_id>' '<client_secret>'")
print(json.dumps({"client_id": cid, "client_secret": sec, "token": tok}))
PY
)" || { echo "$PARSED"; exit 1; }
CLIENT_ID="$(printf '%s' "$PARSED" | python3 -c 'import json,sys; print(json.load(sys.stdin)["client_id"])')"
CLIENT_SECRET="$(printf '%s' "$PARSED" | python3 -c 'import json,sys; print(json.load(sys.stdin)["client_secret"])')"
TOKEN="$(printf '%s' "$PARSED" | python3 -c 'import json,sys; print(json.dumps(json.load(sys.stdin)["token"]))')"

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
