# MyRNApp

A simple, accessible chat application built with React Native and Expo. Users can enter a display name, choose a background color, and enter a chat room where they can send text messages, share photos from their library or camera, and optionally send their current location. Messages are synced in real-time with Firestore and cached locally for offline viewing.

This project was built as a learning exercise aligned with CareerFoundry’s Achievement 5 brief.

## Demo

- Start Screen: Enter your name, choose a background color, and tap “Start Chatting”
- Chat Screen: Send text, images, and location; messages persist online and offline

## Features

- Start Screen
  - Enter display name
  - Choose chat background color (predefined swatches)
  - Branded background image with overlay for contrast

- Chat Screen
  - Real-time messages (Firestore + Gifted Chat)
  - Send images (photo library or camera)
  - Send current location (renders a small map preview)
  - Offline support: view cached messages when offline
  - Accessibility: labeled controls, roles, hints

- Navigation
  - React Navigation stack: Welcome → Start → Chat
  - Chat header shows the user’s name

## Tech Stack

- React Native + Expo
- React Navigation (stack)
- Gifted Chat
- Firebase (Auth, Firestore, Storage)
- AsyncStorage (local cache)
- @react-native-community/netinfo (network detection)
- expo-image-picker, expo-location
- react-native-maps
- expo/react-native-action-sheet
- react-native-dotenv


# Prerequisites
- Node.js (v18 or later recommended)
- npm or yarn
- Expo CLI (npm install -g expo-cli)

## Getting Started

1. Clone the repo
- git clone https://github.com/claudias-hub/MyRNApp.git
- cd MyRNApp

2. Install dependencies
- npm install


3. Configure Firebase
- Create a Firebase project and enable:
Authentication → Anonymous
Firestore Database
Storage

4. Create a .env file in the project root with:
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
FIREBASE_MEASUREMENT_ID=...
Ensure @env is configured in your babel config (e.g., module:react-native-dotenv)

# iOS/Android Permissions
Ensure required permissions are declared by Expo config (camera, media library, location)

5. Run the app
- npx expo start

6. Use the Expo Go app (physical phone) or an emulator/simulator

# EAS Build & Deployment
The app is configured for EAS (Expo Application Services) builds.
See eas.json for build profiles (development, preview, production).
- To build:
npx eas build --platform ios|android

# Project Structure
.
├─ App.js
├─ firebase.js
├─ components/
│  ├─ Welcome.js
│  ├─ Start.js
│  ├─ Chat.js
│  └─ CustomActions.js
├─ assets/
│  └─ frank-leuderalbert-PfUw6vlPc3M-unsplash.jpg
├─ .env
└─ README.md


# Offline Behavior
When offline, Firestore network is disabled and cached messages from AsyncStorage are displayed.
Sending new messages is disabled offline (input hidden), preventing errors.

# Accessibility
Accessibility roles, labels, and hints on Start controls and Custom Actions
High contrast button styles and overlay to improve text legibility on background image

# Known Limitations
Single “room” chat example (no multi-room support)
Local-only simulation for some behaviors (e.g., no read receipts)
Minimal error UI (alerts/logs)

# Scripts
Start: npx expo start
Android: npx expo run:android (EAS build preferred for production)
iOS: npx expo run:ios

# License
Specify your license here (e.g., MIT, Apache 2.0, etc.)