#import "FileLogger.h"

#define LOG_LEVEL_DEF ddLogLevel
#import <CocoaLumberjack/CocoaLumberjack.h>

static const DDLogLevel ddLogLevel = DDLogLevelDebug;

@interface FileLogger ()
@property (nonatomic, strong) DDFileLogger* fileLogger;
@end

@implementation FileLogger

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(configure:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    
    NSNumber* rollingFrequency = options[@"rollingFrequency"];
    NSNumber* maximumFileSize = options[@"maximumFileSize"];
    NSNumber* maximumNumberOfFiles = options[@"maximumNumberOfFiles"];
    NSString* logsDirectory = options[@"logsDirectory"];
    
    id<DDLogFileManager> fileManager = [[DDLogFileManagerDefault alloc] initWithLogsDirectory:logsDirectory];
    fileManager.maximumNumberOfLogFiles = [maximumNumberOfFiles unsignedIntegerValue];
    
    DDFileLogger* fileLogger = [[DDFileLogger alloc] initWithLogFileManager:fileManager];
    fileLogger.rollingFrequency = [rollingFrequency doubleValue];
    fileLogger.maximumFileSize = [maximumFileSize unsignedIntegerValue];
    [DDLog addLogger:fileLogger];
    self.fileLogger = fileLogger;
    
    resolve(nil);
}

RCT_EXPORT_METHOD(debug:(NSString*)str) {
    DDLogDebug(@"%@", str);
}

RCT_EXPORT_METHOD(info:(NSString*)str) {
    DDLogInfo(@"%@", str);
}

RCT_EXPORT_METHOD(warn:(NSString*)str) {
    DDLogWarn(@"%@", str);
}

RCT_EXPORT_METHOD(error:(NSString*)str) {
    DDLogError(@"%@", str);
}

RCT_EXPORT_METHOD(getLogFiles:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    resolve(self.fileLogger.logFileManager.sortedLogFilePaths);
}

@end

