package com.betomorrow.rnfilelogger;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReadableMap;

abstract class FileLoggerSpec extends ReactContextBaseJavaModule {

    FileLoggerSpec(ReactApplicationContext context) {
        super(context);
    }

    public abstract void configure(ReadableMap options, Promise promise);

    public abstract void write(double level, String str);

    public abstract void getLogFilePaths(Promise promise);

    public abstract void deleteLogFiles(Promise promise);

    public abstract void sendLogFilesByEmail(ReadableMap options, Promise promise);

}
