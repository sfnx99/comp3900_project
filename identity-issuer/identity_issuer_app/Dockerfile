# Use the official Flutter image as the base image
FROM cirrusci/flutter:stable

# Set the working directory inside the container
WORKDIR /app

# Copy the pubspec files and install dependencies
COPY pubspec.* ./
RUN flutter pub get

# Copy the rest of the application code to the working directory
COPY . .

# Build the Flutter web application
RUN flutter build web

# Use a simple web server to serve the built Flutter web app
FROM nginx:alpine
COPY --from=0 /app/build/web /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Command to run the application
CMD ["nginx", "-g", "daemon off;"]