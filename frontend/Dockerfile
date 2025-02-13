# Stage 1: Build
FROM node:18 as build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the project files
COPY . .

# Build the Vite project
RUN npm run build

# Stage 2: Run with Node.js
FROM node:18-alpine

WORKDIR /app

# Install a lightweight static file server
RUN npm install -g serve

# Copy the built frontend files from the build stage
COPY --from=build /app/dist /app/dist

# Expose port 3000
EXPOSE 3000

# Serve the static files using "serve"
CMD ["serve", "-s", "dist", "-l", "3000"]
