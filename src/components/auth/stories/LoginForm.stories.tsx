/* eslint-disable storybook/no-renderer-packages */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react';
import LoginForm from '../LoginForm';

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


export const Default: Story = {
  args: {
    onLogin: (credentials: any) => {
      console.log('Login with:', credentials);
    },
  },
};


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
