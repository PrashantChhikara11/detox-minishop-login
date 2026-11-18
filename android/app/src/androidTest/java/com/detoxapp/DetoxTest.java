package com.detoxapp;

import com.wix.detox.Detox;
import com.wix.detox.config.DetoxConfig;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;

/**
 * Detox entry point inside the test APK.
 * The Android instrumentation runner starts this "test", which hands control to Detox.
 * From then on, Detox receives commands from the Jest tests over WebSocket.
 */
@RunWith(AndroidJUnit4.class)
@LargeTest
public class DetoxTest {
    // false, false = don't auto-launch the activity; Detox launches it (device.launchApp)
    @Rule
    public ActivityTestRule<MainActivity> mActivityRule =
            new ActivityTestRule<>(MainActivity.class, false, false);

    @Test
    public void runDetoxTests() {
        DetoxConfig detoxConfig = new DetoxConfig();
        detoxConfig.idlePolicyConfig.masterTimeoutSec = 90;
        detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 60;
        // Debug builds load JS from Metro, which is slower on first load
        detoxConfig.rnContextLoadTimeoutSec = (BuildConfig.DEBUG ? 180 : 60);

        Detox.runTests(mActivityRule, detoxConfig);
    }
}
