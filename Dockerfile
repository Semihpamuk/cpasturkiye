# CPAS Türkiye (Jale) — Next.js 15 / React 19 production image
# Node 20 (Next 15 + React 19 için gerekli). Nixpacks yerine güvenilir Docker derlemesi.
FROM node:20-alpine

WORKDIR /app

# Bağımlılıkları önce kopyala (katman önbelleği için)
COPY package.json package-lock.json ./
RUN npm ci

# NEXT_PUBLIC_* değişkenleri BUILD ZAMANINDA istemci bundle'ına gömülür.
#
# Aşağıdaki ARG'lar `docker build --build-arg` ile değer verilebilsin diye duruyor.
# Bu projenin Easypanel kurulumunda ise "Build Arguments" diye bir alan YOK:
# servis ayarlarındaki "Create env file" seçeneği açık ve değişkenler build
# bağlamına `.env` olarak yazılıyor; aşağıdaki `COPY . .` onu imaja alıyor ve
# `next build` `.env`'i okuyarak değerleri gömüyor. Yani Easypanel'de değişkeni
# Ortam sayfasına yazmak yeterli — ayrıca build argümanı vermeye gerek yok.
# (2026-09-13'te canlı bundle incelenerek doğrulandı.)
#
# Boş bırakılırsa site normal çalışır, yalnızca ölçüm kapalı olur.
ARG NEXT_PUBLIC_GA_ID=""
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID

# Search Console doğrulama meta etiketi — aynı build-time kuralı geçerli.
# Boş bırakılırsa etiket hiç basılmaz (GSC'de Google Analytics yöntemiyle
# doğrulama yapıldıysa bu değere zaten gerek yok).
ARG NEXT_PUBLIC_GSC_VERIFICATION=""
ENV NEXT_PUBLIC_GSC_VERIFICATION=$NEXT_PUBLIC_GSC_VERIFICATION

# Meta Pixel ID — aynı build-time kuralı geçerli (bkz. .env.example).
# Boş bırakılırsa pixel hiç yüklenmez.
ARG NEXT_PUBLIC_META_PIXEL_ID=""
ENV NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID

# Google Tag Manager kapsayıcı kimliği — aynı build-time kuralı geçerli.
# Boş bırakılırsa gtm.js hiç yüklenmez. GTM burada yalnızca KAPSAYICI:
# GA4 ve Meta Pixel etiketleri kodda duruyor, GTM'e ayrıca eklenmemeli.
ARG NEXT_PUBLIC_GTM_ID=""
ENV NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID

# Kaynak kodu kopyala ve production derlemesi yap
# (NODE_ENV burada henüz production değil, böylece devDependencies build sırasında kullanılabilir)
COPY . .
RUN npm run build

# Çalışma zamanı ayarları
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "start"]
