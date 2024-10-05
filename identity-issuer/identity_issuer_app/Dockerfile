FROM cirrusci/flutter:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the pubspec.yaml and other necessary project files into the container
COPY pubspec.yaml ./

# Run flutter pub get to install dependencies
RUN flutter pub get

# Copy the rest of the app source code into the container
COPY . .

# Expose the default Flutter web port (adjust as needed)
EXPOSE 5000

# Set the command to run the Flutter app in Chrome
CMD ["flutter", "run", "-d", "chrome"]
