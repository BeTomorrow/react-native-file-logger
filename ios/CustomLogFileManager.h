#import <CocoaLumberjack/CocoaLumberjack.h>

@interface CustomLogFileManager : DDLogFileManagerDefault

@property (nonatomic, strong) NSString *fileName;

- (instancetype)initWithLogsDirectory:(NSString *)logsDirectory fileName:(NSString *)name;

@end
