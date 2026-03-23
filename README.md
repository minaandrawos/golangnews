# Go News

A modern Go programming language news aggregator for iOS and Android, powered by [golangnews.com](https://golangnews.com/).

Built with [Expo](https://expo.dev/) SDK 54 and [React Native](https://reactnative.dev/).

---

## Screenshots

### Android

| Dark Mode | Light Mode |
|:-:|:-:|
| ![Android dark mode](assets/screenshots/dark.png) | ![Android light mode](assets/screenshots/light.png) |

### iOS

| Dark Mode | Light Mode |
|:-:|:-:|
| ![iOS dark mode](assets/screenshots/ios_dark.png) | ![iOS light mode](assets/screenshots/ios_light.png) |

The app follows your device's system appearance setting automatically.

---

## Features

- Live RSS feed from golangnews.com
- 10 categories: Home, New, Top, Code, Videos, Jobs, Events, Books, Podcasts, Show
- Tap hashtag pills to browse stories by tag
- In-app article reader (WebView) with progress indicator
- Pull-to-refresh
- Skeleton loading animation
- System dark / light theme

---

## Running locally

```bash
npm install
npx expo start
```

Scan the QR code with [Expo Go](https://expo.dev/go) (SDK 54) to run on your phone.

To build and run on an Android emulator:

```bash
npx expo run:android
```

To build and run on an iOS simulator (macOS only):

> **Prerequisites:** Xcode installed, license accepted (`sudo xcodebuild -license accept`), Xcode toolchain selected (`sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`), and CocoaPods installed (`gem install cocoapods`).

```bash
npx expo run:ios
```

---
