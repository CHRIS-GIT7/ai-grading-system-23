FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ARG VITE_API_BASE=http://localhost:4001/api
ENV VITE_API_BASE=$VITE_API_BASE
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
