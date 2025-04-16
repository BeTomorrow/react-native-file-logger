# https://github.com/tony19/logback-android/issues/344
# https://github.com/BeTomorrow/react-native-file-logger/issues/71
#
# @noproxy finding about Proguard enabled making logback-android crash: 
#
# AGP enables R8 full mode by default since 8.0.0.
# It affects all logback-android versions.
# And the R8 full mode has some behaviors difference, and the relevant change is:
# The default constructor (<init>()) is not implicitly kept when a class is kept.
# 
# This rules prevents crash on release mode Proguard enabled.
-keepclassmembers class ch.qos.logback.core.rolling.helper.* { <init>(); }

# To fix log file PARSER ERROR
# Keep all Logback classes and their members
-keep class ch.qos.logback.** { *; }
-dontwarn ch.qos.logback.**

# Keep SLF4J classes (used by Logback)
-keep class org.slf4j.** { *; }
-dontwarn org.slf4j.**

# Ensure default constructors and methods are kept for critical Logback components
-keepclassmembers class ch.qos.logback.core.** { <init>(...); }
-keepclassmembers class ch.qos.logback.classic.** { <init>(...); }

# Prevent R8 from optimizing away reflection or dynamic class loading
-keep class ch.qos.logback.core.pattern.** { *; }
-keep class ch.qos.logback.core.encoder.** { *; }
-keep class ch.qos.logback.core.rolling.** { *; }