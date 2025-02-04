FROM node:22.13-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json before other files
# This allows Docker to cache the npm install step if dependencies haven't changed
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the project
RUN ["npm", "run", "build"]

FROM node:22.13-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install --production

# Expose the application port
EXPOSE 3000

# Use the entrypoint script
ENTRYPOINT ["npm", "run", "start"]
