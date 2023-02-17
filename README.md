# React-native-file-logger

_A simple file-logger for React Native with configurable rolling policy, based on CocoaLumberjack on iOS and Logback on Android._

## Features

- **💆‍♂️ Easy to setup**: Just call `FileLogger.configure()` and you're done. All your existing `console.log/debug/...` calls are automatically logged into a file
- **🌀 File rolling**: Support for time and size-based file rolling. Max number of files and size-limit can be configured. File rolling can also be disabled.
- **📬 Email support**: Logging into a file is useless if users cannot send logs back to developers. With react-native-file-logger, file logs can be sent by email without having to rely on another library
- **🛠 TypeScript support**: Being written entirely in TypeScript, react-native-file-logger has always up-to-date typings

## How it works

React-native-file-logger uses the [undocumented](https://github.com/facebook/react-native/blob/3c9e5f1470c91ff8a161d8e248cf0a73318b1f40/Libraries/polyfills/console.js#L433) `global.__inspectorLog` from React Native. It allows to intercept any calls to `console` and to retrieve the already-formatted log message. React-native-file-logger uses file-loggers from [CocoaLumberjack](https://github.com/CocoaLumberjack/CocoaLumberjack) on iOS and [Logback Android](https://github.com/tony19/logback-android) on Android to append messages into log files with an optional rolling policy.

## Installation

```sh
npm i react-native-file-logger
npx pod-install
```

### New architecture

For react-native 0.71 and higher, next version is compatible with current and new architecture.

```sh
npm i react-native-file-logger@next
# New architecture
cd ios && RCT_NEW_ARCH_ENABLED=1 bundle exec pod install
# OR, if you are using current architecture (backward compatibility)
# npx pod-install
```

## Getting started

```
import { FileLogger } from "react-native-file-logger";

FileLogger.configure();
```

This is all you need to add file-logging to your app. All your existing `console` calls will be appended to a log file. `FileLogger.configure()` also takes options to customize the rolling policy, log directory path or log-level. If you don't want to use `console` calls for logging, you can also use the [direct access API](#direct-access-api).

## API

#### FileLogger.configure(options?): Promise

Initialize the file-logger with the specified options. As soon as the returned promise is resolved, all `console` calls are appended to a log file. To ensure that no logs are missing, it is good practice to `await` this call at the launch of your app.

| Option                 | Description                                                                                                                                                                               | Default                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `logLevel`             | Minimum log level for file output (it won't affect console output)                                                                                                                        | LogLevel.Debug                             |
| `formatter`            | A function that takes the log level and message and returns the formatted string to write to the log file.                                                                                | Default format: `${now} [${level}] ${msg}` |
| `captureConsole`       | If `true`, all `console` calls are automatically captured and written to a log file. It can also be changed by calling the `enableConsoleCapture()` and `disableConsoleCapture()` methods | `true`                                     |
| `dailyRolling`         | If `true`, a new log file is created every day                                                                                                                                            | `true`                                     |
| `maximumFileSize`      | A new log file is created when current log file exceeds the given size in bytes. `0` to disable                                                                                           | `1024 * 1024` (1MB)                        |
| `maximumNumberOfFiles` | Maximum number of log files to keep. When a new log file is created, if the total number of files exceeds this limit, the oldest file is deleted. `0` to disable                          | `5`                                        |
| `logsDirectory`        | Absolute path of directory where log files are stored. If not defined, log files are stored in the cache directory of the app                                                             | `undefined`                                |

#### FileLogger.sendLogFilesByEmail(options?): Promise

Send all log files by email. On iOS, it uses `MFMailComposeViewController` to ensure that the user won't leave the app when sending log files.

| Option    | Description                          |
| --------- | ------------------------------------ |
| `to`      | Email address of the recipient       |
| `subject` | Email subject                        |
| `body`    | Plain text body message of the email |

#### FileLogger.enableConsoleCapture()

Enable appending messages from `console` calls to the current log file. It is already enabled by default when calling `FileLogger.configure()`.

#### FileLogger.disableConsoleCapture()

After calling this method, `console` calls will no longer be written to the current log file.

#### FileLogger.setLogLevel(logLevel)

Change the minimum log level for file-output. The initial log level can be passed as an option to `FileLogger.configure()`.

#### FileLogger.getLogLevel(): LogLevel

Return the current log level.

#### FileLogger.getLogFilePaths(): Promise<string[]>

Returns a promise with the absolute paths to the log files.

#### FileLogger.deleteLogFiles(): Promise

Remove all log files. Next `console` calls will be appended to a new empty log file.

## Direct access API

If you don't want to use `console` calls for file-logging, you can directly use the following methods to directly write messages to the log file. It is encouraged to wrap these calls with your own logger API.

### FileLogger.debug(msg)

Shortcut for `FileLogger.write(LogLevel.Debug, msg)`.

### FileLogger.info(msg)

Shortcut for `FileLogger.write(LogLevel.Info, msg)`.

### FileLogger.warn(msg)

Shortcut for `FileLogger.write(LogLevel.Warning, msg)`.

### FileLogger.error(msg)

Shortcut for `FileLogger.write(LogLevel.Error, msg)`.

### FileLogger.write(level, msg)

Append the given message to the log file with the specified log level. The message will be formatted with the `formatter` function specified during the `FileLogger.configure()` call.

## Troubleshooting

### Release build give empty files

If you are using the `console` logger api, please check that you do NOT strip logging from your release build with custom transformers in your `babel.config.js` like [babel-plugin-transform-remove-console](https://github.com/babel/minify/tree/master/packages/babel-plugin-transform-remove-console)
