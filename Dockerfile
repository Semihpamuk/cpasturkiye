# CPAS Türkiye (Jale) — Next.js 15 / React 19 production image
# Node 20 (Next 15 + React 19 için gerekli). Nixpacks yerine güvenilir Docker derlemesi.
FROM node:20-alpine

WORKDIR /app

# Bağımlılıkları önce kopyala (katman önbelleği için)
COPY package.json package-lock.json ./
RUN npm ci

# NEXT_PUBLIC_* değişkenleri BUILD ZAMANINDA istemci bundle'ına gömülür; servis
# (runtime) env'i olarak vermek yetmez. Easypanel'de bu değer "Build Arguments"
# altına girilmeli. Boş bırakılırsa site normal çalışır, yalnızca ölçüm kapalı olur.
ARG NEXT_PUBLIC_GA_ID=""
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID

# Search Console doğrulama meta etiketi — aynı build-time kuralı geçerli.
# Boş bırakılırsa etiket hiç basılmaz (GSC'de Google Analytics yöntemiyle
# doğrulama yapıldıysa bu değere zaten gerek yok).
ARG NEXT_PUBLIC_GSC_VERIFICATION=""
ENV NEXT_PUBLIC_GSC_VERIFICATION=$NEXT_PUBLIC_GSC_VERIFICATION

# Kaynak kodu kopyala ve production derlemesi yap
# (NODE_ENV burada henüz production değil, böylece devDependencies build sırasında kullanılabilir)
COPY . .
RUN npm run build

# Çalışma zamanı ayarları
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "start"]
