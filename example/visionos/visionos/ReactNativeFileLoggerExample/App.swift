import SwiftUI
import React
import React_RCTSwiftExtensions

@main
struct ReactNativeFileLoggerExampleApp: App {
  @UIApplicationDelegateAdaptor var delegate: AppDelegate
  
  var body: some Scene {
    RCTMainWindow(moduleName: "ReactNativeFileLoggerExample")
  }
}
