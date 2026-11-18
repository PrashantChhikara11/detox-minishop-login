/**
 * Detox configuration (Android only for now).
 * Docs: https://wix.github.io/Detox/docs/config/overview
 *
 * @type {Detox.DetoxConfig}
 */

// Windows uses gradlew.bat; Linux/macOS (e.g. GitHub Actions) use ./gradlew
const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';

// Only build native code for the emulator's CPU (x86_64), much faster than all 4 ABIs
const abi = '-PreactNativeArchitectures=x86_64';

module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },

  apps: {
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: `cd android && ${gradlew} assembleDebug assembleAndroidTest -DtestBuildType=debug ${abi}`,
      // Debug builds load JS from Metro on the PC: forward emulator:8081 -> PC:8081
      reversePorts: [8081],
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: `cd android && ${gradlew} assembleRelease assembleAndroidTest -DtestBuildType=release ${abi}`,
    },
  },

  devices: {
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_API_35',
      },
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*',
      },
    },
  },

  configurations: {
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release',
    },
    'android.att.debug': {
      device: 'attached',
      app: 'android.debug',
    },
  },
};
