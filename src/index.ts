import { NativeModules } from "react-native";
import util from "util";
import type RNFileLoggerType from "./NativeFileLogger";

const isTurboModuleEnabled = (global as any).__turboModuleProxy != null;
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
	compressFiles?: boolean;
}

class FileLoggerStatic {
	private _logLevel = LogLevel.Debug;
	private _formatter = defaultFormatter;
	private _originalConsole: {
		debug: typeof console.debug;
		log: typeof console.log;
		info: typeof console.info;
		warn: typeof console.warn;
		error: typeof console.error;
	} | null = null;

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
		// Store original console methods
		this._originalConsole = {
			debug: console.debug,
			log: console.log,
			info: console.info,
			warn: console.warn,
			error: console.error,
		};

		// Override console methods
		console.debug = (...args: any[]) => {
			this.debug(util.format(...args));
			this._originalConsole?.debug(...args);
		};

		console.log = (...args: any[]) => {
			this.info(util.format(...args));
			this._originalConsole?.log(...args);
		};

		console.info = (...args: any[]) => {
			this.info(util.format(...args));
			this._originalConsole?.info(...args);
		};

		console.warn = (...args: any[]) => {
			this.warn(util.format(...args));
			this._originalConsole?.warn(...args);
		};

		console.error = (...args: any[]) => {
			this.error(util.format(...args));
			this._originalConsole?.error(...args);
		};
	}

	disableConsoleCapture() {
		if (this._originalConsole) {
			console.debug = this._originalConsole.debug;
			console.log = this._originalConsole.log;
			console.info = this._originalConsole.info;
			console.warn = this._originalConsole.warn;
			console.error = this._originalConsole.error;
			this._originalConsole = null;
		}
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
		const { to, subject, body, compressFiles = false } = options;
		return RNFileLogger.sendLogFilesByEmail({
			to: to ? (Array.isArray(to) ? to : [to]) : undefined,
			subject,
			body,
			compressFiles,
		});
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
}

export const logLevelNames = ["DEBUG", "INFO", "WARN", "ERROR"];

export const defaultFormatter: LogFormatter = (level, msg) => {
	const now = new Date();
	const levelName = logLevelNames[level];
	return `${now.toISOString()} [${levelName}]  ${msg}`;
};

export const FileLogger = new FileLoggerStatic();
