FROM node:20-bullseye-slim

WORKDIR /app

# Set NODE_ENV for production optimizations
ENV NODE_ENV=production

# Copy only package files first for better cache usage
COPY package*.json ./

RUN npm ci --only=production

# Copy source code
COPY . .

# Use a non-root user for security
RUN useradd --user-group --create-home --shell /bin/false appuser
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/healthz', res => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "src/server.js"]