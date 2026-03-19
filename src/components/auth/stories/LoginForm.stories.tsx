/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react';
import LoginForm from '../LoginForm';

/**
 * LoginForm Component Stories
 *
 * Stories ini menunjukkan berbagai state dan interaksi dari LoginForm component.
 *
 * ## Features
 * - Email dan password input fields
 * - Form validation
 * - Submit handling
 * - Link ke register page
 * - Responsive design
 */

const meta = {
  title: 'Components/Auth/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Login form component untuk autentikasi user. Includes form validation dan responsive design.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onLogin: {
      action: 'logged in',
      description:
        'Callback function yang dipanggil saat form di-submit dengan credentials',
    },
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state dari LoginForm.
 * Form kosong, siap untuk user input.
 */
export const Default: Story = {
  args: {
    onLogin: (credentials: any) => {
      console.log('Login with:', credentials);
    },
  },
};

/**
 * Form dengan email sudah terisi.
 * Berguna untuk testing flow ketika user sudah pernah login sebelumnya.
 */
export const WithEmailFilled: Story = {
  args: {
    onLogin: (credentials: any) => {
      console.log('Login with:', credentials);
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const emailInput = canvas.querySelector(
      'input[type="email"]',
    ) as HTMLInputElement;
    if (emailInput) {
      emailInput.value = 'user@example.com';
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
};

/**
 * Form dengan semua fields terisi.
 * Menunjukkan state sebelum submit.
 */
export const ReadyToSubmit: Story = {
  args: {
    onLogin: (credentials: any) => {
      console.log('Login with:', credentials);
      alert(`Logging in as ${credentials.email}`);
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const emailInput = canvas.querySelector(
      'input[type="email"]',
    ) as HTMLInputElement;
    const passwordInput = canvas.querySelector(
      'input[type="password"]',
    ) as HTMLInputElement;

    if (emailInput) {
      emailInput.value = 'demo@example.com';
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    if (passwordInput) {
      passwordInput.value = 'password123';
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
};

/**
 * Mobile view dari LoginForm.
 * Menunjukkan responsive design pada layar kecil.
 */
export const MobileView: Story = {
  args: {
    onLogin: (credentials: any) => {
      console.log('Login with:', credentials);
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Tablet view dari LoginForm.
 * Menunjukkan responsive design pada layar sedang.
 */
export const TabletView: Story = {
  args: {
    onLogin: (credentials: any) => {
      console.log('Login with:', credentials);
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
