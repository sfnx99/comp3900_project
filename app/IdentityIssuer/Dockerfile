# # Use the official Node.js image as the base image
# FROM node:14

# # Set the working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json to the working directory
# COPY package.json package-lock.json ./

# # Install the dependencies
# RUN npm install

# # Copy the rest of the application code to the working directory
# COPY . .

# # Build the frontend application
# RUN npm run build

# # Install serve to serve the static files
# RUN npm install -g serve

# # Expose the port that the application will run on
# EXPOSE 3001

# # # Define the command to run the application
# # CMD ["serve", "-s", "build", "-l", "3001"]

# # Define the command to run the application
# CMD ["npm" "start"]

FROM node:18

WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]