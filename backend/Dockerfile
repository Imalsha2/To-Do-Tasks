FROM node:18-bullseye-slim AS builder
WORKDIR /app

# Install build deps
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

FROM node:18-bullseye-slim AS runner
WORKDIR /app

# Use a non-root user for runtime
RUN useradd --user-group --create-home --shell /bin/false appuser

# Copy only what we need from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# Set production environment
ENV NODE_ENV=production

# Ensure correct ownership so the non-root user can read files
RUN chown -R appuser:appuser /app

USER appuser
EXPOSE 5000
CMD ["node", "dist/index.js"]
