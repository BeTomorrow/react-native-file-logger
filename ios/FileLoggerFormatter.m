#import "FileLoggerFormatter.h"
#import "FileLogger.h"

@implementation FileLoggerFormatter

- (NSString*)formatLogMessage:(DDLogMessage*)logMessage {
    if (logMessage->_context == FileLogger.loggerContext) {
        return logMessage.message;
    } else {
        return nil;
    }
}

@end
