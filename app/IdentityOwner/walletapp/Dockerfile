# # Use Node.js as the base image
# FROM node:20.14.0-buster-slim

# # Set the working directory inside the container
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code to the container's working directory
# COPY . .

# # Expose the Metro Bundler port (default is 8081 for React Native/Expo)
# EXPOSE 8000

# # Set the environment variables (make sure to replace with your actual local IP address)
# ENV REACT_NATIVE_PACKAGER_HOSTNAME=172.23.0.6

# # Start the Expo development server using npx
# CMD ["npx", "expo", "start"]

FROM node:18

WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8000
CMD ["npm", "start", "--", "--port", "8000"]