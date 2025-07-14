// Log.h
#import "CocoaLumberjack.h"

@interface CustomLogFileManager : DDLogFileManagerDefault

- (instancetype)initWithLogsDirectory:(NSString *)logsDirectory fileName:(NSString *)name;

@end
