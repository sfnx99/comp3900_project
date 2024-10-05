
react native for identity owner mobile application
react native is better for web applications

flutter for service provider and identity issuer
flutter is better for web apps but still has capability for mobile development if we want to add a mobile app for service provider down the line



## As you develop your backend add EVERYTHING to the readme document
## EVERYTHING!




**intial set up**

- required by everyone using application?
- maybe only required for developers 
- developer set up
- non developer set up

**Install React Native CLI if you haven’t already:**

``npm install -g react-native-cli``

- Samantha initial setup
Initialize the React Native app inside the identity-owner/mobile-app folder:

``npx react-native init MobileApp``


**Set Up Flutter for the Web App (Service Provider)**
1. Install Flutter on your local machine if not done already.
2. Initialize the Flutter project inside the service-provider/web-app folder:

``flutter create web-app``




**Running the Docker Environment**

Once you have your Dockerfile and docker-compose.yml files in place, you can spin up all your services with a single command:

``docker-compose up --build``

