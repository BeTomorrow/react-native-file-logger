import { NativeModules } from "react-native";
import type RNFileLoggerType from "./NativeFileLogger";
declare var global: any;

const isTurboModuleEnabled = global.__turboModuleProxy != null;
const RNFileLogger: typeof RNFileLoggerType = isTurboModuleEnabled
	? require("./NativeFileLogger").default
	: NativeModules.FileLogger;

export enum LogLevel {
	Debug,
	Info,
	Warning,
	Error,
}

export type LogFormatter = (level: LogLevel, msg: string) => string;

export interface ConfigureOptions {
	logLevel?: LogLevel;
	formatter?: LogFormatter;
	captureConsole?: boolean;
	dailyRolling?: boolean;
	maximumFileSize?: number;
	maximumNumberOfFiles?: number;
	logsDirectory?: string;
}

export interface SendByEmailOptions {
	to?: string | string[];
	subject?: string;
	body?: string;
}

class FileLoggerStatic {
	private _logLevel = LogLevel.Debug;
	private _formatter = defaultFormatter;

	async configure(options: ConfigureOptions = {}): Promise<void> {
		const {
			logLevel = LogLevel.Debug,
			formatter = defaultFormatter,
			captureConsole = true,
			dailyRolling = true,
			maximumFileSize = 1024 * 1024,
			maximumNumberOfFiles = 5,
			logsDirectory,
		} = options;

		await RNFileLogger.configure({
			dailyRolling,
			maximumFileSize,
			maximumNumberOfFiles,
			logsDirectory,
		});

		this._logLevel = logLevel;
		this._formatter = formatter;

		if (captureConsole) {
			this.enableConsoleCapture();
		}
	}

	enableConsoleCapture() {
		// __inspectorLog is an undocumented feature of React Native
		// that allows to intercept calls to console.debug/log/warn/error
		global.__inspectorLog = this._handleLog;
	}

	disableConsoleCapture() {
		global.__inspectorLog = undefined;
	}

	setLogLevel(logLevel: LogLevel) {
		this._logLevel = logLevel;
	}

	getLogLevel(): LogLevel {
		return this._logLevel;
	}

	getLogFilePaths(): Promise<string[]> {
		return RNFileLogger.getLogFilePaths();
	}

	deleteLogFiles(): Promise<void> {
		return RNFileLogger.deleteLogFiles();
	}

	sendLogFilesByEmail(options: SendByEmailOptions = {}): Promise<void> {
		if (options.to) {
			const toEmails = Array.isArray(options.to) ? options.to : [options.to];
			return RNFileLogger.sendLogFilesByEmail({ ...options, to: toEmails });
		} else {
			return RNFileLogger.sendLogFilesByEmail({ ...options, to: undefined });
		}
	}

	debug(msg: string) {
		this.write(LogLevel.Debug, msg);
	}

	info(msg: string) {
		this.write(LogLevel.Info, msg);
	}

	warn(msg: string) {
		this.write(LogLevel.Warning, msg);
	}

	error(msg: string) {
		this.write(LogLevel.Error, msg);
	}

	write(level: LogLevel, msg: string) {
		if (this._logLevel <= level) {
			RNFileLogger.write(level, this._formatter(level, msg));
		}
	}

	private _handleLog = (level: string, msg: string) => {
		switch (level) {
			case "debug":
				this.debug(msg);
				break;
			case "log":
				this.info(msg);
				break;
			case "warning":
				this.warn(msg);
				break;
			case "error":
				this.error(msg);
				break;
		}
	};
}

export const logLevelNames = ["DEBUG", "INFO", "WARN", "ERROR"];

export const defaultFormatter: LogFormatter = (level, msg) => {
	const now = new Date();
	const levelName = logLevelNames[level];
	return `${now.toISOString()} [${levelName}]  ${msg}`;
};

export const FileLogger = new FileLoggerStatic();
