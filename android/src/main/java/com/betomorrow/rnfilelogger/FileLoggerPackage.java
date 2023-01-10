package com.betomorrow.rnfilelogger;

import androidx.annotation.Nullable;

import java.util.HashMap;
import java.util.Map;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

public class FileLoggerPackage extends TurboReactPackage {

    @Nullable
    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactApplicationContext) {
        if (name.equals("RNFileLogger")) {
            return new FileLoggerModule(reactApplicationContext);
        } else {
            return null;
        }
    }
    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return new ReactModuleInfoProvider() {
            @Override
            public Map<String, ReactModuleInfo> getReactModuleInfos() {
                final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
                boolean isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
                moduleInfos.put(
                        "RNFileLogger",
                        new ReactModuleInfo(
                                "RNFileLogger",
                                "RNFileLogger",
                                false, // canOverrideExistingModule
                                false, // needsEagerInit
                                true, // hasConstants
                                false, // isCxxModule
                                isTurboModule // isTurboModule
                        ));
                return moduleInfos;
            }
        };
    }
}
