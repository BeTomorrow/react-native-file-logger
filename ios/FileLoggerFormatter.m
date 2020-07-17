#import "FileLoggerFormatter.h"

@interface FileLoggerFormatter ()
@property (nonatomic, strong) NSDateFormatter* dateFormatter;
@end

@implementation FileLoggerFormatter

- (instancetype)init {
    self = [super init];
    if (self) {
        self.dateFormatter = [[NSDateFormatter alloc] init];
        self.dateFormatter.dateFormat = @"yyyy-MM-dd HH:mm:ss,SSS";
    }
    return self;
}

- (NSString*)formatLogMessage:(DDLogMessage*)logMessage {
    NSString* logLevel;
    switch (logMessage.flag) {
        case DDLogFlagDebug:
            logLevel = @"DEBUG";
            break;
        case DDLogFlagInfo:
            logLevel = @"INFO";
            break;
        case DDLogFlagWarning:
            logLevel = @"WARN";
            break;
        case DDLogFlagError:
            logLevel = @"ERROR";
            break;
        default:
            logLevel = @"VERBOSE";
            break;
    }
    
    NSString* dateAndTime = [self.dateFormatter stringFromDate:logMessage.timestamp];
    return [NSString stringWithFormat:@"%@ [%@]  %@", dateAndTime, logLevel, logMessage.message];
}

@end
