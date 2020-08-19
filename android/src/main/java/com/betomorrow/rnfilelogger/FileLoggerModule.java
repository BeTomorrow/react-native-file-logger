package com.betomorrow.rnfilelogger;

import android.content.Intent;
import android.net.Uri;

import androidx.core.content.FileProvider;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FilenameFilter;
import java.nio.charset.Charset;
import java.util.ArrayList;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.encoder.PatternLayoutEncoder;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.rolling.FixedWindowRollingPolicy;
import ch.qos.logback.core.rolling.RollingFileAppender;
import ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy;
import ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy;
import ch.qos.logback.core.util.FileSize;

public class FileLoggerModule extends ReactContextBaseJavaModule {
    private static Logger logger = LoggerFactory.getLogger(FileLoggerModule.class);

    private final ReactApplicationContext reactContext;
    private String logsDirectory;
    private ReadableMap configureOptions;

    public FileLoggerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "FileLogger";
    }

    @ReactMethod
    public void configure(ReadableMap options, Promise promise) {
        boolean dailyRolling = options.getBoolean("dailyRolling");
        int maximumFileSize = options.getInt("maximumFileSize");
        int maximumNumberOfFiles = options.getInt("maximumNumberOfFiles");

        logsDirectory = options.hasKey("logsDirectory")
                ? options.getString("logsDirectory")
                : reactContext.getExternalCacheDir() + "/logs";
        String logPrefix = reactContext.getPackageName();

        LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();

        RollingFileAppender<ILoggingEvent> rollingFileAppender = new RollingFileAppender<>();
        rollingFileAppender.setContext(loggerContext);
        rollingFileAppender.setFile(logsDirectory + "/" + logPrefix + "-latest.log");

        if (dailyRolling) {
            SizeAndTimeBasedRollingPolicy<ILoggingEvent> rollingPolicy = new SizeAndTimeBasedRollingPolicy<>();
            rollingPolicy.setContext(loggerContext);
            rollingPolicy.setFileNamePattern(logsDirectory + "/" + logPrefix + "-%d{yyyy-MM-dd}.%i.log");
            rollingPolicy.setMaxFileSize(new FileSize(maximumFileSize));
            rollingPolicy.setTotalSizeCap(new FileSize(maximumNumberOfFiles * maximumFileSize));
            rollingPolicy.setMaxHistory(maximumNumberOfFiles);
            rollingPolicy.setParent(rollingFileAppender);
            rollingPolicy.start();
            rollingFileAppender.setRollingPolicy(rollingPolicy);

        } else if (maximumFileSize > 0) {
            FixedWindowRollingPolicy rollingPolicy = new FixedWindowRollingPolicy();
            rollingPolicy.setContext(loggerContext);
            rollingPolicy.setFileNamePattern(logsDirectory + "/" + logPrefix + "-%i.log");
            rollingPolicy.setMinIndex(1);
            rollingPolicy.setMaxIndex(maximumNumberOfFiles);
            rollingPolicy.setParent(rollingFileAppender);
            rollingPolicy.start();
            rollingFileAppender.setRollingPolicy(rollingPolicy);

            SizeBasedTriggeringPolicy triggeringPolicy = new SizeBasedTriggeringPolicy();
            triggeringPolicy.setContext(loggerContext);
            triggeringPolicy.setMaxFileSize(new FileSize(maximumFileSize));
            triggeringPolicy.start();
            rollingFileAppender.setTriggeringPolicy(triggeringPolicy);
        }

        PatternLayoutEncoder encoder = new PatternLayoutEncoder();
        encoder.setContext(loggerContext);
        encoder.setCharset(Charset.forName("UTF-8"));
        encoder.setPattern("%date [%level]  %msg%n");
        encoder.start();

        rollingFileAppender.setEncoder(encoder);
        rollingFileAppender.start();

        ch.qos.logback.classic.Logger root = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
        root.setLevel(Level.DEBUG);
        root.detachAndStopAllAppenders();
        root.addAppender(rollingFileAppender);

        configureOptions = options;
        promise.resolve(null);
    }

    @ReactMethod
    public void debug(String str) {
        logger.debug(str);
    }

    @ReactMethod
    public void info(String str) {
        logger.info(str);
    }

    @ReactMethod
    public void warn(String str) {
        logger.warn(str);
    }

    @ReactMethod
    public void error(String str) {
        logger.error(str);
    }

    @ReactMethod
    public void getLogFilePaths(Promise promise) {
        try {
            WritableArray result = Arguments.createArray();
            for (File logFile: getLogFiles()) {
                result.pushString(logFile.getAbsolutePath());
            }
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void deleteLogFiles(Promise promise) {
        try {
            for (File file: getLogFiles()) {
                file.delete();
            }
            if (configureOptions != null) {
                configure(configureOptions, promise);
            } else {
                promise.resolve(null);
            }
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void sendLogFilesByEmail(ReadableMap options, Promise promise) {
        try {
            String to = options.hasKey("to") ? options.getString("to") : null;
            String subject = options.hasKey("subject") ? options.getString("subject") : null;
            String body = options.hasKey("body") ? options.getString("body") : null;

            Intent intent = new Intent(Intent.ACTION_SEND_MULTIPLE, Uri.parse("mailto:"));
            intent.setType("plain/text");
            
            if (to != null) {
                intent.putExtra(Intent.EXTRA_EMAIL, new String[]{to});
            }
            if (subject != null) {
                intent.putExtra(Intent.EXTRA_SUBJECT, subject);
            }
            if (body != null) {
                intent.putExtra(Intent.EXTRA_TEXT, body);
            }

            ArrayList<Uri> uris = new ArrayList<>();
            for (File file : getLogFiles()) {
                Uri fileUri = FileProvider.getUriForFile(
                        reactContext,
                        reactContext.getApplicationContext().getPackageName() + ".provider",
                        file);
                uris.add(fileUri);
            }
            intent.putParcelableArrayListExtra(Intent.EXTRA_STREAM, uris);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);
            
            reactContext.startActivity(intent);

            promise.resolve(null);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    private File[] getLogFiles() {
        File directory = new File(logsDirectory);
        return directory.listFiles(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String name) {
                return name.endsWith(".log");
            }
        });
    }
}
