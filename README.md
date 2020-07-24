# React-native-file-logger

_A simple file-logger for React Native with configurable rolling policy, based on CocoaLumberjack on iOS and Logback on Android._

## Features
* **💆‍♂️ Easy to setup**: Just call `FileLogger.configure()` and you're done. All your existing `console.log/debug/...` calls are automatically logged into a file
* **🌀 File rolling**: Support for time and size-based file rolling. Max number of files and size-limit can be configured. File rolling can also be disabled.
* **📬 Email support**: Logging into a file is useless if users cannot send logs back to developers. With react-native-file-logger, file logs can be send by email without having to rely on another library
* **🛠 TypeScript support**: Being written entirely in TypeScript, react-native-file-logger has always up-to-date typings

## How it works
React-native-file-logger uses the [undocumented](https://github.com/facebook/react-native/blob/3c9e5f1470c91ff8a161d8e248cf0a73318b1f40/Libraries/polyfills/console.js#L433) `global.__inspectorLog` from React-native. It allows to intercept any calls to `console` and to retrieve the already-formatted log string. It uses file-loggers from [CocoaLumberjack](https://github.com/CocoaLumberjack/CocoaLumberjack) on iOS and [Logback Android](https://github.com/tony19/logback-android) on Android to log into files with configurable rolling policy.

## Installation

```sh
npm i react-native-file-logger
npx pod-install
```

## Getting started

```
import { FileLogger } from "react-native-file-logger";

FileLogger.configure();
```

This is all you need to add file-logging to your app. `FileLogger.configure()` can take options to customize the rolling policy, log directory path or log-level.

## API

