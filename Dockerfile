# Use official Node.js LTS version (Render supports Node 20)
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy remaining source files
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Expose the port Render assigns (not fixed 4000)
EXPOSE 8080

# Start the application (Render expects the app to listen on process.env.PORT)
CMD ["npm", "start"]

