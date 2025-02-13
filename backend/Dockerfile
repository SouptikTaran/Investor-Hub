FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

# Copy the rest of the app
COPY . .

# Generate Prisma Client
RUN npx prisma generate

FROM node:18-alpine

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app /app

EXPOSE 8000

CMD ["node", "src/index.js"]
