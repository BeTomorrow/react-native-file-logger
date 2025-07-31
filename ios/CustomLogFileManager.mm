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
    [formatter setDateFormat:@"yyyy-MM-dd_HH-mm-ss"];
    NSString *timestamp = [formatter stringFromDate:[NSDate date]];

    if (self.fileName && [self.fileName length]) {
        return [NSString stringWithFormat:@"%@.log", self.fileName];
    }
    NSString *appName = self.fileName;
    if (!appName || appName.length == 0) {
        appName = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleDisplayName"];
    }
    if (!appName || appName.length == 0) {
        appName = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleName"];
    }
    return [NSString stringWithFormat:@"%@_%@.log", appName, timestamp];
}

- (BOOL)isLogFile:(NSString *)fileName
{
    NSString *appName = self.fileName;
    if (!appName || appName.length == 0) {
        appName = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleDisplayName"];
    }
    if (!appName || appName.length == 0) {
        appName = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleName"];
    }
    return [fileName hasPrefix: appName];
}

@end
