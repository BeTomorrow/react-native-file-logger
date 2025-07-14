import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export type NativeConfigureOptions = {
	dailyRolling: boolean;
	maximumFileSize: number;
	maximumNumberOfFiles: number;
	logsDirectory?: string;
	logPrefix?: string;
};

export type SendByEmailOptions = {
	to?: string[];
	subject?: string;
	body?: string;
	compressFiles: boolean;
};

export interface Spec extends TurboModule {
	configure(options: NativeConfigureOptions): Promise<void>;
	write(level: number, msg: string): void;
	getLogFilePaths(): Promise<string[]>;
	deleteLogFiles(): Promise<void>;
	sendLogFilesByEmail(options: SendByEmailOptions): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("FileLogger");
