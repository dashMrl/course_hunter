FROM node:10.3.0-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm i --only=production && npm cache clean --force

FROM base AS builder
COPY . .
RUN npm i --only=development && \
    npm run build

FROM base
COPY --from=builder /app/dist ./dist
RUN echo "Asia/Shanghai" > /etc/timezone
CMD [ "dist/index.js" ]
ENTRYPOINT [ "node" ]
