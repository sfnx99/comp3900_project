# Wallet

## Installation Instructions

Our React Native App was built using the Expo SDK. To run the app on your phone you need to install the "Expo" App on iOS or Android. The Google Play store link is available [here](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_AU) and the app store link is available [here](https://apps.apple.com/us/app/expo-go/id982107779).

### Installation without Docker


Install all the packages:

```bash
npm install
```

To run the app do the following command

```bash
npx expo start
```
Scan the QR code that appears and the app will open on the Expo app.

### Installation with Docker


It works by doing the following command in the root directory.

```bash
docker-compose up
```

You then scan the provided QR code and open the app using Expo on your device. This also works even if you are not on the same network as your device.

