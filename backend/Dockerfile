# FROM node:18-alpine AS build
# WORKDIR /app
# RUN apk add --no-cache openssl
# COPY package.json package-lock.json ./
# RUN npm install
# COPY . .
# RUN npm run prisma:generate
# RUN npm run build

# FROM node:18-alpine AS runtime
# WORKDIR /app
# RUN apk add --no-cache openssl curl
# COPY --from=build /app/package.json ./
# COPY --from=build /app/package-lock.json ./
# COPY --from=build /app/dist ./dist
# COPY --from=build /app/prisma ./prisma
# COPY --from=build /app/node_modules ./node_modules
# ENV NODE_ENV=production
# EXPOSE 4000
# CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node dist/index.js"]


FROM node:18-alpine AS build
WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app
RUN apk add --no-cache openssl curl
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules ./node_modules

# Force the environment variables directly here
# Replace the placeholders with your actual strings (without the quotes)
ENV DATABASE_URL=postgresql://postgres:YOUR_PASSWORD_HERE@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
ENV DIRECT_URL=postgresql://postgres:YOUR_PASSWORD_HERE@db.ccetgfdwvabtjbapmwxe.supabase.co:5432/postgres

EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]