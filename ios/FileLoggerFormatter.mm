#import "FileLoggerFormatter.h"

@implementation FileLoggerFormatter

- (NSString*)formatLogMessage:(DDLogMessage*)logMessage {
    return logMessage.message;
}

@end
