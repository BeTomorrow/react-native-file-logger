export declare enum LogLevel {
    Debug = 0,
    Info = 1,
    Warning = 2,
    Error = 3
}
export declare type LogFormatter = (level: LogLevel, msg: string) => string;
export interface ConfigureOptions {
    logLevel?: LogLevel;
    formatter?: LogFormatter;
    captureConsole?: boolean;
    dailyRolling?: boolean;
    maximumFileSize?: number;
    maximumNumberOfFiles?: number;
    logsDirectory?: string;
    loggerContext?: number;
}
export interface SendByEmailOptions {
    to?: string;
    subject?: string;
    body?: string;
}
declare class FileLoggerStatic {
    private _logLevel;
    private _formatter;
    configure(options?: ConfigureOptions): Promise<void>;
    enableConsoleCapture(): void;
    disableConsoleCapture(): void;
    setLogLevel(logLevel: LogLevel): void;
    getLogLevel(): LogLevel;
    getLogFilePaths(): Promise<string[]>;
    deleteLogFiles(): Promise<void>;
    sendLogFilesByEmail(options?: SendByEmailOptions): Promise<void>;
    debug(msg: string): void;
    info(msg: string): void;
    warn(msg: string): void;
    error(msg: string): void;
    write(level: LogLevel, msg: string): void;
    private _handleLog;
}
export declare const logLevelNames: string[];
export declare const defaultFormatter: LogFormatter;
export declare const FileLogger: FileLoggerStatic;
export {};
