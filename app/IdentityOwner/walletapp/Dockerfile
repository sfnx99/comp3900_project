# Use Node.js as the base image
FROM node:20.14.0-buster-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container's working directory
COPY . .

# Expose the Metro Bundler port (default is 8081 for React Native/Expo)
EXPOSE 8081

# Set the environment variables (make sure to replace with your actual local IP address)
ENV REACT_NATIVE_PACKAGER_HOSTNAME=192.168.20.17

# Start the Expo development server using npx
CMD ["npx", "expo", "start"]
