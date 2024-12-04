👋 This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app)

# Bank Transaction History Module
This is a React Native Expo application that displays transaction history with biometric authentication and filtering capabilities.

## :bulb: Features
- Biometric authentication for secure access
- Transaction list view with sensitive info such as 'Amount' masked until authenticated
- Detailed transaction information on tap
- Pull-to-refresh functionality 
- Search and filter transactions by type

## :wrench: Setup Requirements
- Node.js
- Expo Go app (iOS/Android)
- Device with biometric capabilities

## :muscle: Get Started
1. Clone repository
   ```bash
   git clone [this-repo-url]
   cd [project-directory]
   ```
   
1. Install dependencies
   ```bash
   npm install
   ```

2. Start the development server
   ```bash
    npx expo start
   ```
3. Open the Expo Go App on mobile
4. Scan QR code generated in the terminal
5. Start app and test

## :white_check_mark: Testing Notes
Feel free to test the following features:
- View masked transactions
- Authenticate using biometrics
- Pull down to refresh (currently adds randomised transactions)
- Search transactions by description
- Filter by type (Credit/Debit)
- Tap transaction for detailed screen


In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo


## Explore Expo
- [Expo on GitHub](https://github.com/expo/expo): View open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
