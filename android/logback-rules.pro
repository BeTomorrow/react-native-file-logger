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