#import "CustomLogFileManager.h"

@implementation CustomLogFileManager

#pragma mark - Lifecycle method

- (instancetype)initWithLogsDirectory:(NSString *)logsDirectory
                             fileName:(NSString *)name
{
    self = [super initWithLogsDirectory:logsDirectory];
    if (self) {
        self.fileName = name;
    }
    return self;
}

#pragma mark - Override methods

- (NSString *)newLogFileName
{
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"yyyy-MM-dd"];
    NSString *dateString = [formatter stringFromDate:[NSDate date]];
    
    NSDateFormatter *timeFormatter = [[NSDateFormatter alloc] init];
    [timeFormatter setDateFormat:@"HHmmss"];
    NSString *timeString = [timeFormatter stringFromDate:[NSDate date]];

    NSString *logPrefix = self.fileName;
    if (!logPrefix || logPrefix.length == 0) {
        logPrefix = [[NSBundle mainBundle] bundleIdentifier];
        if (!logPrefix || logPrefix.length == 0) {
            logPrefix = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleDisplayName"];
            if (!logPrefix || logPrefix.length == 0) {
                logPrefix = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleName"];
            }
        }
    }
    
    return [NSString stringWithFormat:@"%@-%@-%@.log", logPrefix, dateString, timeString];
}

- (BOOL)isLogFile:(NSString *)fileName
{
    NSString *logPrefix = self.fileName;
    if (!logPrefix || logPrefix.length == 0) {
        logPrefix = [[NSBundle mainBundle] bundleIdentifier];
        if (!logPrefix || logPrefix.length == 0) {
            logPrefix = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleDisplayName"];
            if (!logPrefix || logPrefix.length == 0) {
                logPrefix = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleName"];
            }
        }
    }
    
    NSString *expectedPrefix = [NSString stringWithFormat:@"%@-", logPrefix];
    return [fileName hasPrefix:expectedPrefix] && [fileName hasSuffix:@".log"];
}

@end
