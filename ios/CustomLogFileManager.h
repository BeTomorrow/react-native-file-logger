#import <CocoaLumberjack/CocoaLumberjack.h>

@interface CustomLogFileManager : DDLogFileManagerDefault

- (instancetype)initWithLogsDirectory:(NSString *)logsDirectory fileName:(NSString *)name;

@end
