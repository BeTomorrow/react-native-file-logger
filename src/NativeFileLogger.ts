import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

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

export interface Spec extends TurboModule {
	configure(options: ConfigureOptions): void;
	write(level: LogLevel, msg: string): void;
	getLogFilePaths(): Promise<string[]>;
	deleteLogFiles(): Promise<void>;
	sendLogFilesByEmail(options: SendByEmailOptions): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("RNFileLogger");
