# =============================================
# Stage 1: Install dependencies
# =============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only package files first for better layer caching
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# =============================================
# Stage 2: Build the application
# =============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the production bundle
RUN npm run build

# =============================================
# Stage 3: Production — serve the static files
# =============================================
FROM node:20-alpine AS production

WORKDIR /app

# Install 'serve' globally for static file serving
RUN npm install -g serve@latest

# Copy only the built output from builder stage
COPY --from=builder /app/dist ./dist

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose port 80
EXPOSE 80

# Serve the SPA on port 80 (-s flag enables SPA fallback for React Router)
CMD ["serve", "-s", "dist", "-l", "80"]
