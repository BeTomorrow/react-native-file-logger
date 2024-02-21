require "json"

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

  s.source_files = "ios/**/*.{h,mm}"
  s.framework    = "MessageUI"
  
  s.dependency "React-Core"
  s.dependency "CocoaLumberjack"
  
  ## Dependencies needed for new architecture.
  install_modules_dependencies(s)

end

