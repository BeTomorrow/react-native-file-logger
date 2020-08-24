import { NativeModules } from "react-native";

declare var global: any;

const { FileLogger: RNFileLogger } = NativeModules;

export enum LogLevel {
	Debug,
	Info,
	Warning,
	Error,
}

const logLevelNames = ["DEBUG", "INFO", "WARN", "ERROR"];

export interface ConfigureOptions {
	logLevel?: LogLevel;
	captureConsole?: boolean;
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

	async configure(options: ConfigureOptions = {}): Promise<void> {
		const {
			logLevel = LogLevel.Debug,
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

		this.setLogLevel(logLevel);

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
		return RNFileLogger.sendLogFilesByEmail(options);
	}

	debug(str: string) {
		this.write(LogLevel.Debug, str);
	}

	info(str: string) {
		this.write(LogLevel.Info, str);
	}

	warn(str: string) {
		this.write(LogLevel.Warning, str);
	}

	error(str: string) {
		this.write(LogLevel.Error, str);
	}

	write(level: LogLevel, str: string) {
		if (this._logLevel <= level) {
			const now = new Date();
			const levelName = logLevelNames[level];
			const formatted = `${now} [${levelName}]  ${str}`;
			this.writeRaw(level, formatted);
		}
	}

	writeRaw(level: LogLevel, str: string) {
		RNFileLogger.write(level, str);
	}

	private _handleLog = (level: string, str: string) => {
		switch (level) {
			case "debug":
				this.debug(str);
				break;
			case "log":
				this.info(str);
				break;
			case "warning":
				this.warn(str);
				break;
			case "error":
				this.error(str);
				break;
		}
	};
}

export const FileLogger = new FileLoggerStatic();
