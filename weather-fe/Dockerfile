# React Dockerfile
FROM node:18 as build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

CMD ["npm", "start"]

# Expose the port the app runs on
EXPOSE 3000

# # Serve the app with a static file server
# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 3000

# # Command to run Nginx
# CMD ["nginx", "-g", "daemon off;"]
