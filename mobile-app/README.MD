# To bootstap the app

-   npx create-expo-app@latest --template blank-typescript

# Libs used

-   [Expo router](https://expo.github.io/router/docs/) - npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

-   [React Hook Form](https://react-hook-form.com/) - npm install react-hook-form

-   [Zod](https://zod.dev/) - npm install zod @hookform/resolvers

-   [Tanstack Query](https://tanstack.com/query/latest) - npm install @tanstack/react-query

-   [React Native Paper](https://nativebase.io/) - npm install react-native-paper react-native-vector-icons

-   [others]
    -   npm install react-native-reanimated react-native-gesture-handler
    -   npm install axios
    -   npm install @react-native-async-storage/async-storage

# How to run the app:

1. Install Expo Go in your phone

2. Run the app

    2.1 Open the terminal in the root folder of the project and run:

    ```bash
    npx expo start
    ```

    2.2. Scan the QR code in the terminal using expo go

    Note: If erro occurs, follow the steps below to fix it.

# Fix error with expo go in Windows

### 1.1. Get your ipv4 address ----> ipconfig (run this command in terminal)

### 1.2. Run this command in terminal to fix the error:

```bash
set REACT_NATIVE_PACKAGER_HOSTNAME="your_ipv4_address"
```

### 1.3 Restart the app (and possibly the vscode or terminal used to run the app)

## Now the app should run in your phone.

## Note - This fixes the error but if yout ip changes, you will need to run the command again with the new ip address.
