import { test, expect } from '@playwright/test';

/**
 * Skenario Testing E2E - Login Flow
 *
 * - Login Flow
 *  - should display login page correctly
 *    - should show login form
 *    - should show email and password inputs
 *    - should show submit button
 *    - should show link to register page
 *  - should successfully login with valid credentials
 *    - should fill email input
 *    - should fill password input
 *    - should submit the form
 *    - should redirect to home page after successful login
 *    - should display user information or logout button
 *  - should show error message with invalid credentials
 *    - should fill email with invalid credentials
 *    - should fill password with invalid credentials
 *    - should submit the form
 *    - should display error alert or message
 *    - should stay on login page
 */

test.describe('Login Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login');
  });

  test('should display login page correctly', async ({ page }) => {
    // Assert page title or heading
    await expect(
      page.getByRole('heading', { name: /selamat datang/i }),
    ).toBeVisible();

    // Assert form elements
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /masuk sekarang/i }),
    ).toBeVisible();

    // Assert link to register
    await expect(
      page.getByRole('link', { name: /daftar gratis/i }),
    ).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Setup: Listen for dialog (alert) events
    page.on('dialog', async (dialog) => {
      console.log('Dialog message:', dialog.message());
      await dialog.accept();
    });

    // Fill in the login form with valid credentials
    // NOTE: Gunakan credentials yang valid dari API Dicoding
    await page.getByLabel(/email/i).fill('bisajaya@gmail.com');
    await page.getByLabel(/password/i).fill('qwertyui');

    // Submit the form
    await page.getByRole('button', { name: /masuk sekarang/i }).click();

    // Wait for navigation or response
    await page.waitForLoadState('networkidle');

    // Assert: Should redirect to home page after successful login
    // The URL should change from /login to / or /home
    await expect(page).toHaveURL(/\/(home)?$/);

    // Assert: User should be logged in
    // Look for logout button or user menu
    // Adjust selector based on your actual UI
    const logoutButton = page.getByRole('button', { name: /logout|keluar/i });
    const userMenu = page.getByText(/testuser/i);

    // At least one should be visible
    const isLoggedIn =
      (await logoutButton.isVisible().catch(() => false)) ||
      (await userMenu.isVisible().catch(() => false));

    expect(isLoggedIn).toBe(true);
  });

  test('should show error message with invalid credentials', async ({
    page,
  }) => {
    // 1. Isi form dengan kredensial yang salah
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');

    // 2. SETUP: Beri tahu Playwright untuk bersiap menangkap dialog alert
    const dialogPromise = page.waitForEvent('dialog');

    // 3. ACTION: Klik tombol submit
    await page.getByRole('button', { name: /masuk sekarang/i }).click();

    // 4. WAIT: Tunggu sampai dialog alert benar-benar muncul (tanpa batas waktu kaku)
    const dialog = await dialogPromise;

    // 5. ASSERT: Pastikan pesan di dalam alert sesuai
    expect(dialog.message()).toMatch(/email or password is wrong|gagal|error/i);

    // 6. Tutup alert agar tidak memblokir browser
    await dialog.accept();

    // 7. ASSERT: Pastikan tetap berada di halaman login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should navigate to register page when clicking register link', async ({
    page,
  }) => {
    // Click on the register link
    await page.getByRole('link', { name: /daftar gratis/i }).click();

    // Assert: Should navigate to register page
    await expect(page).toHaveURL(/\/register/);

    // Assert: Register page elements should be visible
    await expect(
      page.getByRole('heading', { name: /daftar akun/i }),
    ).toBeVisible();
  });

  test('should not submit form when email is empty', async ({ page }) => {
    // Fill only password
    await page.getByLabel(/password/i).fill('qwertyui');

    // Try to submit
    await page.getByRole('button', { name: /masuk sekarang/i }).click();

    // Assert: Should stay on login page (form validation prevents submission)
    await expect(page).toHaveURL(/\/login/);

    // Email input should have validation error or be focused
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeFocused();
  });

  test('should not submit form when password is empty', async ({ page }) => {
    // Fill only email
    await page.getByLabel(/email/i).fill('bisajaya@gmail.com');

    // Try to submit
    await page.getByRole('button', { name: /masuk sekarang/i }).click();

    // Assert: Should stay on login page (form validation prevents submission)
    await expect(page).toHaveURL(/\/login/);
  });
});
