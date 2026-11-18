import { by, device, element, expect, waitFor } from 'detox';

const VALID_EMAIL = 'test@minishop.com';
const VALID_PASSWORD = 'Password123';

describe('Login', () => {
  beforeEach(async () => {
    // Fresh app process for every test (back on Login, empty fields).
    // Not device.reloadReactNative(): on RN 0.84 New Architecture (bridgeless) it returns
    // before the app re-renders, so the next action hits the old, discarded views.
    await device.launchApp({ newInstance: true });
    // Portrait on every launch: in landscape Android swaps in a full-screen keyboard
    // editor that hides the app, so typed text never reaches our inputs.
    await device.setOrientation('portrait');
  });

  it('shows the login screen on launch', async () => {
    await expect(element(by.id('login-screen'))).toBeVisible();
    await expect(element(by.id('login-email-input'))).toBeVisible();
    await expect(element(by.id('login-password-input'))).toBeVisible();
    await expect(element(by.id('login-button'))).toBeVisible();
  });

  it('logs in with valid credentials', async () => {
    // replaceText sets the value without opening the soft keyboard, so the
    // keyboard can't cover (or be animating over) the Login button when we tap it
    await element(by.id('login-email-input')).replaceText(VALID_EMAIL);
    await element(by.id('login-password-input')).replaceText(VALID_PASSWORD);
    await element(by.id('login-button')).tap();

    // The fake login takes ~800 ms; waitFor polls until the Home screen appears
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('home-welcome-text'))).toHaveText('Welcome, Test User!');
  });

  it('logs in by typing and pressing the keyboard ✓ key', async () => {
    // typeText = real keystrokes through the soft keyboard (closest to a real user)
    await element(by.id('login-email-input')).typeText(VALID_EMAIL);
    await element(by.id('login-password-input')).typeText(VALID_PASSWORD);
    // ✓ on the password field submits the form (onSubmitEditing in LoginScreen)
    await element(by.id('login-password-input')).tapReturnKey();

    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('home-welcome-text'))).toHaveText('Welcome, Test User!');
  });

  it('shows an error for a wrong password', async () => {
    await element(by.id('login-email-input')).replaceText(VALID_EMAIL);
    await element(by.id('login-password-input')).replaceText('WrongPassword');
    await element(by.id('login-button')).tap();

    await waitFor(element(by.id('login-error')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('login-error'))).toHaveText('Invalid email or password');
    await expect(element(by.id('home-screen'))).not.toExist();
  });
});
