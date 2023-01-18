#ifdef RCT_NEW_ARCH_ENABLED
#import "FileLoggerSpec.h"

@interface FileLogger : NSObject <NativeFileLoggerSpec>
#else
#import <React/RCTBridgeModule.h>

@interface FileLogger : NSObject <RCTBridgeModule>
#endif

@end
