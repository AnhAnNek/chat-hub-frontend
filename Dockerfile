# Use an official Node.js runtime as a base image
FROM --platform=linux/amd64 node:14-alpine

# Set the working directory inside the container
WORKDIR /chat-hub-frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "start"]