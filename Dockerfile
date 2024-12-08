# Use the official Node.js image with a lightweight Alpine variant
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container for dependency installation
COPY package.json package-lock.json ./

# Install all dependencies, including devDependencies (needed for TypeScript compilation)
RUN npm install

# Copy the rest of the application source code into the container
COPY . .

# Build the TypeScript application
RUN npm run build

# Verify if the dist folder is created (optional for debugging)
RUN ls -R dist || echo "dist folder not found!"

# Expose the port your application runs on (default 3000 for Node.js)
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
