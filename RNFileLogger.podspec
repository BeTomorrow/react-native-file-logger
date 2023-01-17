require "json"

folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'
package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RNFileLogger"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://github.com/BeTomorrow/react-native-file-logger"
  s.license      = "MIT"
  s.authors      = { "BeTomorrow" => "streny@betomorrow.com" }
  s.platforms    = { :ios => "11.0" }
  s.source       = { :git => "https://github.com/BeTomorrow/react-native-file-logger.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,m,mm,swift,cpp}"
  
  s.dependency "React-Core"
  s.dependency "CocoaLumberjack"
  
  ## Dependencies needed for new architecture
  s.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
  s.pod_target_xcconfig    = {
      "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
      "OTHER_CPLUSPLUSFLAGS" => "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1",
      "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
  }
  s.dependency "React-Codegen"
  s.dependency "RCT-Folly"
  s.dependency "RCTRequired"
  s.dependency "RCTTypeSafety"
  s.dependency "ReactCommon/turbomodule/core"

end

