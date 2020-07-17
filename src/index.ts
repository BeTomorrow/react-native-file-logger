import { NativeModules } from "react-native";

declare var global: any;

const { FileLogger: RNFileLogger } = NativeModules;

export enum LogLevel {
	Debug,
	Info,
	Warning,
	Error,
}

export interface ConfigureOptions {
	logLevel?: LogLevel;
	dailyRolling?: boolean;
	maximumFileSize?: number;
	maximumNumberOfFiles?: number;
	logsDirectory?: string;
}

export interface SendByEmailOptions {
	to?: string;
	subject?: string;
	body?: string;
}

class FileLoggerStatic {
	private _logLevel = LogLevel.Debug;

	configure(options: ConfigureOptions = {}): Promise<void> {
		const {
			logLevel = LogLevel.Debug,
			dailyRolling = true,
			maximumFileSize = 1024 * 1024,
			maximumNumberOfFiles = 5,
			logsDirectory,
		} = options;

		this.setLogLevel(logLevel);
		this.enable();

		return RNFileLogger.configure({
			dailyRolling,
			maximumFileSize,
			maximumNumberOfFiles,
			logsDirectory,
		});
	}

	enable() {
		// __inspectorLog is an undocumented feature of React Native
		// that allows to intercept calls to console.debug/log/warn/error
		global.__inspectorLog = this._handleLog;
	}

	disable() {
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
		return RNFileLogger.sendLogFilesByEmail(options);
	}

	private _handleLog = (level: string, str: string) => {
		switch (level) {
			case "debug":
				this._debug(str);
				break;
			case "warning":
				this._warn(str);
				break;
			case "error":
				this._error(str);
				break;
			default:
				this._info(str);
				break;
		}
	};

	private _debug(str: string) {
		if (this._logLevel <= LogLevel.Debug) {
			RNFileLogger.debug(str);
		}
	}

	private _info(str: string) {
		if (this._logLevel <= LogLevel.Info) {
			RNFileLogger.info(str);
		}
	}

	private _warn(str: string) {
		if (this._logLevel <= LogLevel.Warning) {
			RNFileLogger.warn(str);
		}
	}

	private _error(str: string) {
		if (this._logLevel <= LogLevel.Error) {
			RNFileLogger.error(str);
		}
	}
}

export const FileLogger = new FileLoggerStatic();
