# CPAS Türkiye (Jale) — Next.js 15 / React 19 production image
# Node 20 (Next 15 + React 19 için gerekli). Nixpacks yerine güvenilir Docker derlemesi.
FROM node:20-alpine

WORKDIR /app

# Bağımlılıkları önce kopyala (katman önbelleği için)
COPY package.json package-lock.json ./
RUN npm ci

# Kaynak kodu kopyala ve production derlemesi yap
# (NODE_ENV burada henüz production değil, böylece devDependencies build sırasında kullanılabilir)
COPY . .
RUN npm run build

# Çalışma zamanı ayarları
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "start"]
