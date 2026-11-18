# MiniShop: Detox E2E Login Demo (Android)

[![E2E (Detox, Android)](https://github.com/PrashantChhikara11/detox-minishop-login/actions/workflows/e2e-android.yml/badge.svg)](https://github.com/PrashantChhikara11/detox-minishop-login/actions/workflows/e2e-android.yml)

A small React Native app with an end-to-end **login test** written in **Detox + TypeScript**.

**See it run without installing anything:** open the [Actions tab](https://github.com/PrashantChhikara11/detox-minishop-login/actions). Every push builds the app and runs the tests on an Android emulator in GitHub's cloud.

| | |
|---|---|
| App | React Native **0.84.1** (TypeScript, New Architecture, Hermes) |
| E2E framework | **Detox 20.51.4** + Jest 29 + ts-jest |
| Platform | Android emulator (tested on Windows 11, API 35 emulator) |

## What's tested

`e2e/login.test.ts`:

| Test | Checks |
|---|---|
| shows the login screen on launch | email field, password field and Login button are visible |
| logs in with valid credentials | fills `test@minishop.com` / `Password123`, taps **Login**, sees "Welcome, Test User!" |
| logs in by typing and pressing the keyboard ✓ key | types with real keystrokes, submits with the keyboard's ✓, sees "Welcome, Test User!" |
| shows an error for a wrong password | sees "Invalid email or password" and stays on Login |

Elements are located by `testID` (e.g. `login-email-input`, `login-button`), the mobile equivalent of `data-testid`.

## Project layout

```
App.tsx                          # switches between Login and Home
src/auth.ts                      # fake login (no backend), ~800 ms delay
src/screens/LoginScreen.tsx      # testIDs: login-screen, login-email-input, login-password-input, login-button, login-error
src/screens/HomeScreen.tsx       # testIDs: home-screen, home-welcome-text, logout-button
.detoxrc.js                      # Detox config: apps, devices (AVD), configurations
e2e/jest.config.js               # Jest config for Detox (TypeScript via ts-jest)
e2e/tsconfig.json                # TS config for the tests
e2e/login.test.ts                # the login tests
android/app/src/androidTest/java/com/detoxapp/DetoxTest.java   # Detox entry point in the test APK
android/app/src/main/res/xml/network_security_config.xml       # allows the app to reach Detox/Metro on the PC
```

## Prerequisites

- Node.js **22.11+**
- **JDK 17** (`JAVA_HOME` pointing to it)
- Android SDK with `ANDROID_HOME` set, plus these packages:
  - `platforms;android-36`, `build-tools;36.0.0`, `ndk;27.1.12297006`, `cmake;3.31.6`
  - an x86_64 system image, e.g. `system-images;android-35;google_apis;x86_64`
- An emulator (AVD) named **`Pixel_API_35`**, or change `avdName` in `.detoxrc.js`:
  ```sh
  avdmanager create avd -n Pixel_API_35 -k "system-images;android-35;google_apis;x86_64" -d pixel_7
  ```

## Run it

```sh
npm install

# Terminal 1: Metro (debug builds load JavaScript from it)
npm start

# Terminal 2: build the app + test APK, then run the tests
npm run e2e:build      # = detox build -c android.emu.debug   (first build: several minutes)
npm run e2e:test       # = detox test  -c android.emu.debug
```

Detox boots the `Pixel_API_35` emulator itself if it isn't already running.

Expected:

```
 PASS  e2e/login.test.ts
  Login
    √ shows the login screen on launch
    √ logs in with valid credentials
    √ logs in by typing and pressing the keyboard ✓ key
    √ shows an error for a wrong password

Tests:       4 passed, 4 total
```

Failure screenshots/logs: add `--take-screenshots failing --record-logs failing` → saved under `artifacts/`.

### Release build (no Metro needed)

```sh
npm run e2e:build:release
npm run e2e:test:release
```

## CI (GitHub Actions)

`.github/workflows/e2e-android.yml` runs on every push to `main`, on pull requests, and on demand (**Actions → E2E (Detox, Android) → Run workflow**):

1. Ubuntu runner + Node 22 + JDK 17 + Gradle cache, KVM enabled for a fast emulator
2. Installs the SDK packages the app needs (platform 36, NDK 27.1, CMake 3.31.6)
3. `npx detox build -c android.emu.release` (JS bundled into the APK, so no Metro)
4. Boots an API 35 emulator named `Pixel_API_35` ([android-emulator-runner](https://github.com/ReactiveCircus/android-emulator-runner)), turns off auto-rotate, closes any system dialogs, and runs `npx detox test -c android.emu.release`
5. On failure, prints which window had focus and uploads screenshots, logs and videos as the `detox-artifacts` artifact

A full run takes about 7 minutes. The emulator runs with `-no-snapshot-save`: without it, saving a quick-boot snapshot on shutdown made the job hang after the tests had already passed.

## Test design notes (Android + RN 0.84 New Architecture)

- **Fresh app per test:** `device.launchApp({ newInstance: true })` in `beforeEach`. `device.reloadReactNative()` was avoided: in bridgeless mode it returns before the app re-renders, so the next action hits stale views.
- **Portrait locked in `AndroidManifest.xml`** (`android:screenOrientation="portrait"`). In landscape, Android shows a full-screen keyboard editor that hides the app. `device.setOrientation()` is avoided: it needs window focus, and on a freshly booted CI emulator a system dialog can hold focus.
- **Keyboard vs taps:** the soft keyboard is a separate system window that Detox doesn't synchronize with. Tapping Login right after closing the keyboard races its hide animation, so the tap gets lost. The button test uses `replaceText` (no keyboard), and the typing test submits with the ✓ key instead of tapping.
- No hard sleeps. Async results use `waitFor(...).toBeVisible().withTimeout(...)`.

## Windows notes

- `android/app/build.gradle` pins **CMake 3.31.6**: its bundled ninja 1.12 handles file paths longer than 260 characters (the default CMake 3.22.1 doesn't). Windows long paths must also be enabled (`LongPathsEnabled=1`).
- `.detoxrc.js` picks `gradlew.bat` on Windows and `./gradlew` elsewhere.
- Builds only the `x86_64` ABI (`-PreactNativeArchitectures=x86_64`) for speed.
