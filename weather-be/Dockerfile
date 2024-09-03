# Node.js Dockerfile
FROM node:18.20.4

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Command to run the Node.js app
CMD ["node", "app.js"]
