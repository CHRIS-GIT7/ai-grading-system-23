FROM node:18-alpine AS build
WORKDIR /app
RUN apk add --no-cache openssl

# Add these lines to accept variables from Railway
ARG DATABASE_URL
ARG DIRECT_URL
ENV DATABASE_URL=$DATABASE_URL
ENV DIRECT_URL=$DIRECT_URL

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN rm -rf node_modules/.prisma
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
ENV NODE_ENV=production
EXPOSE 4000
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node dist/index.js"]


