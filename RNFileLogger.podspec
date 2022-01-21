require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RNFileLogger"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://github.com/BeTomorrow/react-native-file-logger"
  s.license      = "MIT"
  s.authors      = { "BeTomorrow" => "streny@betomorrow.com" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/BeTomorrow/react-native-file-logger.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency "CocoaLumberjack"
end

