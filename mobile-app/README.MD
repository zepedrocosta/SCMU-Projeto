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
