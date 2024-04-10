#import "FileLogger.h"

#define LOG_LEVEL_DEF ddLogLevel
#import <CocoaLumberjack/CocoaLumberjack.h>
#import <MessageUI/MessageUI.h>
#import "FileLoggerFormatter.h"

enum LogLevel {
    LOG_LEVEL_DEBUG,
    LOG_LEVEL_INFO,
    LOG_LEVEL_WARNING,
    LOG_LEVEL_ERROR
};

static const DDLogLevel ddLogLevel = DDLogLevelDebug;

@interface FileLogger () <MFMailComposeViewControllerDelegate>
@property (nonatomic, strong) DDFileLogger* fileLogger;
@end

@implementation FileLogger

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(configure:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSNumber* dailyRolling = options[@"dailyRolling"];
    NSNumber* maximumFileSize = options[@"maximumFileSize"];
    NSNumber* maximumNumberOfFiles = options[@"maximumNumberOfFiles"];
    NSString* logsDirectory = options[@"logsDirectory"];

    if (self.fileLogger) {
        [DDLog removeLogger:self.fileLogger];
    }
    
    id<DDLogFileManager> fileManager = [[DDLogFileManagerDefault alloc] initWithLogsDirectory:logsDirectory];
    fileManager.maximumNumberOfLogFiles = [maximumNumberOfFiles unsignedIntegerValue];
    fileManager.logFilesDiskQuota = 0;
    
    DDFileLogger* fileLogger = [[DDFileLogger alloc] initWithLogFileManager:fileManager];
    fileLogger.logFormatter = [[FileLoggerFormatter alloc] init];
    fileLogger.rollingFrequency = [dailyRolling boolValue] ? 24 * 60 * 60 : 0;
    fileLogger.maximumFileSize = [maximumFileSize unsignedIntegerValue];

    [DDLog addLogger:fileLogger];
    self.fileLogger = fileLogger;
    
    resolve(nil);
}

RCT_EXPORT_METHOD(write:(NSNumber* _Nonnull)level str:(NSString*)str) {
    switch (level.integerValue) {
        case LOG_LEVEL_DEBUG:
            DDLogDebug(@"%@", str);
            break;
        case LOG_LEVEL_INFO:
            DDLogInfo(@"%@", str);
            break;
        case LOG_LEVEL_WARNING:
            DDLogWarn(@"%@", str);
            break;
        case LOG_LEVEL_ERROR:
            DDLogError(@"%@", str);
            break;
    }
}

RCT_EXPORT_METHOD(getLogFilePaths:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    resolve(self.fileLogger.logFileManager.sortedLogFilePaths);
}

RCT_EXPORT_METHOD(deleteLogFiles:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [self.fileLogger rollLogFileWithCompletionBlock:^{
        for (DDLogFileInfo* logFileInfo in [self.fileLogger.logFileManager unsortedLogFileInfos]) {
            if (logFileInfo.isArchived) {
                [[NSFileManager defaultManager] removeItemAtPath:logFileInfo.filePath error:nil];
            }
        }
        resolve(nil);
    }];
}

RCT_EXPORT_METHOD(sendLogFilesByEmail:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSArray<NSString*>* to = options[@"to"];
    NSString* subject = options[@"subject"];
    NSString* body = options[@"body"];
    
    if (![MFMailComposeViewController canSendMail]) {
        reject(@"CannotSendMail", @"Cannot send emails on this device", nil);
        return;
    }
    
    MFMailComposeViewController* composeViewController = [[MFMailComposeViewController alloc] init];
    composeViewController.mailComposeDelegate = self;
    if (to) {
        [composeViewController setToRecipients:to];
    }
    if (subject) {
        [composeViewController setSubject:subject];
    }
    if (body) {
        [composeViewController setMessageBody:body isHTML:NO];
    }
    
    NSArray<NSString*>* logFiles = self.fileLogger.logFileManager.sortedLogFilePaths;
    for (NSString* logFile in logFiles) {
        NSData* data = [NSData dataWithContentsOfFile:logFile];
        [composeViewController addAttachmentData:data mimeType:@"text/plain" fileName:[logFile lastPathComponent]];
    }
    
    UIViewController* presentingViewController = UIApplication.sharedApplication.delegate.window.rootViewController;
    while (presentingViewController.presentedViewController) {
        presentingViewController = presentingViewController.presentedViewController;
    }
    [presentingViewController presentViewController:composeViewController animated:YES completion:nil];
    
    resolve(nil);
}

- (void)mailComposeController:(MFMailComposeViewController*)controller didFinishWithResult:(MFMailComposeResult)result error:(NSError*)error {
    [controller dismissViewControllerAnimated:YES completion:nil];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeFileLoggerSpecJSI>(params);
}

// Signature only used by the new architecture.
- (void)configure:(JS::NativeFileLogger::NativeConfigureOptions &)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    NSString* logsDirectory = options.logsDirectory();
    NSMutableDictionary * optionsDict = [NSMutableDictionary dictionary];
    [optionsDict setValue:@(options.dailyRolling()) forKey:@"dailyRolling"];
    [optionsDict setValue:@(options.maximumFileSize()) forKey:@"maximumFileSize"];
    [optionsDict setValue:@(options.maximumNumberOfFiles()) forKey:@"maximumNumberOfFiles"];
    if (logsDirectory) {
        [optionsDict setValue:logsDirectory forKey:@"logsDirectory"];
    }
    [self configure:optionsDict resolver:resolve rejecter:reject];
}


- (void)sendLogFilesByEmail:(JS::NativeFileLogger::SendByEmailOptions &)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    NSDictionary * optionsDict = @{
            @"subject": options.subject(),
            @"body": options.body(),
            @"to": convertToNSArray(options.to())
        };
    [self sendLogFilesByEmail:optionsDict resolver:resolve rejecter:reject];
}


- (void)write:(double)level msg:(NSString *)msg {
    NSNumber* _Nonnull logLevel = [NSNumber numberWithInt:level];
    [self write:logLevel str:msg];
}

NSArray<NSString *> *convertToNSArray(std::optional<FB::LazyVector<NSString *, id>> optional) {
    if (optional.has_value()) {
        FB::LazyVector<NSString *, id> value = optional.value();
        NSMutableArray<NSString *> *result = [[NSMutableArray alloc] initWithCapacity:value.size()];
        for (const auto &string : value) {
            [result addObject:string];
        }
        return result;
    } else {
        return [[NSArray alloc] init];
    }
}
#endif


@end

