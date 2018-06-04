FROM node:10.3.0-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm i --only=production && npm cache clean --force

FROM base AS builder
COPY . .
RUN npm i --only=development
RUN npm run build

FROM base
COPY --from=builder /app/dist ./dist
CMD [ "dist/index.js" ]
ENTRYPOINT [ "node" ]
