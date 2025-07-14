// Log.m
#import <Foundation/Foundation.h>

#import "Log.h"

@interface CustomLogFileManager ()

@property (nonatomic, copy) NSString *fileName;

@end

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
    
    // 使用应用名称作为前缀（从 Info.plist 获取）
    
    NSString *appName = self.fileName;
    if (!appName || appName.length == 0) {
        appName = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleDisplayName"];
    }
    if (!appName || appName.length == 0) {
        appName = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleName"];
    }
    // 自定义文件名为 "AppName_时间戳.log"
    return [NSString stringWithFormat:@"%@_%@.log", appName, timestamp];
    // return [NSString stringWithFormat:@"%@", self.fileName];
}

- (BOOL)isLogFile:(NSString *)fileName
{
    return [fileName isEqualToString:self.fileName];
}

@end
