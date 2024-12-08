# Build Stage
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install all dependencies, including devDependencies
RUN npm install

# Copy the application source code
COPY . .

# Compile the TypeScript application
RUN npm run build

# Production Stage
FROM node:20-alpine AS production

# Set the working directory
WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled code from the build stage
COPY --from=build /app/dist ./dist

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/server.js"]
