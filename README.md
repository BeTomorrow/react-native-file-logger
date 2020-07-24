# React-native-file-logger

_A simple file-logger for React Native with customizable rolling policy, based on CocoaLumberjack on iOS and Logback on Android._

## Features
* **💆‍♂️ Easy to setup**: Just call `FileLogger.configure()` and you're done. All your existing `console.log/debug/...` calls are automatically logged into a file
* **🌀 File rolling**: Support for time and size-based file rolling. Max number of files and size-limit can be configured. File rolling can also be disabled.
* **📬 Email support**: Logging into a file is useless if users cannot send logs back to developers. With react-native-file-logger, file logs can be send by email without having to rely on another library
* **🛠 TypeScript support**: Being written entirely in TypeScript, react-native-file-logger has always up-to-date typings

## Getting started

`$ npm install react-native-file-logger --save`

### Mostly automatic installation

`$ react-native link react-native-file-logger`

## Usage

```javascript
import { FileLogger } from "react-native-file-logger";
```
