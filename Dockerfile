# CPAS Türkiye (Jale) — Next.js 15 / React 19 production image
# Node 20 (Next 15 + React 19 için gerekli). Nixpacks yerine güvenilir Docker derlemesi.
FROM node:20-alpine

WORKDIR /app

# Bağımlılıkları önce kopyala (katman önbelleği için)
COPY package.json package-lock.json ./
RUN npm ci

# NEXT_PUBLIC_* değişkenleri BUILD ZAMANINDA istemci bundle'ına gömülür.
#
# KURAL: Tarayıcıya gidecek her NEXT_PUBLIC_* değişkeni aşağıdaki gibi
# `ARG` + `ENV` çiftiyle BİLDİRİLMELİ. Easypanel, Ortam sayfasındaki değerleri
# yalnızca Dockerfile'da ARG olarak bildirilen isimlere build argümanı olarak
# geçiriyor; bildirilmeyenler build'e girmez. `.env` de `.dockerignore` ile
# imaj dışında tutulduğu için başka bir yol yok.
#
# Bildirilmeyen bir değişkenin sonucu sessiz bir HİDRASYON HATASI olur: sunucu
# çalışma zamanı env'ini görüp gerçek değeri basar, tarayıcı bundle'ı koddaki
# varsayılanı taşır, React #418 ile o parçayı istemcide yeniden çizer.
# (2026-09-20: NEXT_PUBLIC_SITE_PHONE bu yüzden footer'dan kayboluyordu.)
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

# Site kimlik bilgileri (lib/site.ts) — footer, iletişim ve yasal sayfalarda
# hem sunucu hem istemci tarafında basılır; ikisi aynı değeri görmeli.
# Boş bırakılırsa lib/site.ts'teki varsayılan kullanılır (telefon için placeholder!).
ARG NEXT_PUBLIC_SITE_PHONE=""
ENV NEXT_PUBLIC_SITE_PHONE=$NEXT_PUBLIC_SITE_PHONE
ARG NEXT_PUBLIC_SITE_MERSIS=""
ENV NEXT_PUBLIC_SITE_MERSIS=$NEXT_PUBLIC_SITE_MERSIS
ARG NEXT_PUBLIC_SITE_TAX_OFFICE=""
ENV NEXT_PUBLIC_SITE_TAX_OFFICE=$NEXT_PUBLIC_SITE_TAX_OFFICE
ARG NEXT_PUBLIC_SITE_TAX_ID=""
ENV NEXT_PUBLIC_SITE_TAX_ID=$NEXT_PUBLIC_SITE_TAX_ID
ARG NEXT_PUBLIC_SITE_TRADE_REGISTRY=""
ENV NEXT_PUBLIC_SITE_TRADE_REGISTRY=$NEXT_PUBLIC_SITE_TRADE_REGISTRY
ARG NEXT_PUBLIC_SITE_KEP=""
ENV NEXT_PUBLIC_SITE_KEP=$NEXT_PUBLIC_SITE_KEP

# Kaynak kodu kopyala ve production derlemesi yap
# (NODE_ENV burada henüz production değil, böylece devDependencies build sırasında kullanılabilir)
COPY . .
RUN npm run build

# Çalışma zamanı ayarları
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "start"]
