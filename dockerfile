# ---- Build Stage ----
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Bundle app source
COPY . .

# Build the application
RUN npm run build

# ---- Production Stage ----
FROM node:20 AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies with forced rebuild of bcrypt
RUN npm ci --only=production
RUN npm rebuild bcrypt --build-from-source

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Set environment to production
ENV NODE_ENV production

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["node", "dist/main"]