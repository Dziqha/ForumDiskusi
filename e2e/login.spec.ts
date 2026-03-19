import { test, expect } from '@playwright/test';

test.describe('Login Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login page correctly', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /selamat datang/i }),
    ).toBeVisible();

    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /masuk sekarang/i }),
    ).toBeVisible();

    await expect(
      page.getByRole('link', { name: /daftar gratis/i }),
    ).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      console.log('Dialog message:', dialog.message());
      await dialog.accept();
    });


    await page.getByLabel(/email/i).fill('bisajaya@gmail.com');
    await page.getByLabel(/password/i).fill('qwertyui');

    await page.getByRole('button', { name: /masuk sekarang/i }).click();

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/(home)?$/);


    const logoutButton = page.getByRole('button', { name: /logout|keluar/i });
    const userMenu = page.getByText(/testuser/i);

    const isLoggedIn =
      (await logoutButton.isVisible().catch(() => false)) ||
      (await userMenu.isVisible().catch(() => false));

    expect(isLoggedIn).toBe(true);
  });

  test('should show error message with invalid credentials', async ({
    page,
  }) => {
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');

    const dialogPromise = page.waitForEvent('dialog');

    await page.getByRole('button', { name: /masuk sekarang/i }).click();

    const dialog = await dialogPromise;

    expect(dialog.message()).toMatch(/email or password is wrong|gagal|error/i);

    await dialog.accept();

    await expect(page).toHaveURL(/\/login/);
  });

  test('should navigate to register page when clicking register link', async ({
    page,
  }) => {
    await page.getByRole('link', { name: /daftar gratis/i }).click();

    await expect(page).toHaveURL(/\/register/);

    await expect(
      page.getByRole('heading', { name: /daftar akun/i }),
    ).toBeVisible();
  });

  test('should not submit form when email is empty', async ({ page }) => {
    await page.getByLabel(/password/i).fill('qwertyui');

    await page.getByRole('button', { name: /masuk sekarang/i }).click();

    await expect(page).toHaveURL(/\/login/);

    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeFocused();
  });

  test('should not submit form when password is empty', async ({ page }) => {
    await page.getByLabel(/email/i).fill('bisajaya@gmail.com');

    await page.getByRole('button', { name: /masuk sekarang/i }).click();

    await expect(page).toHaveURL(/\/login/);
  });
});
