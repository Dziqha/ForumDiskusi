import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../LoginForm';


describe('LoginForm Component', () => {
  it('should render login form correctly', () => {
    const mockOnLogin = vi.fn();

    render(<LoginForm onLogin={mockOnLogin} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /masuk sekarang/i })).toBeInTheDocument();
    expect(screen.getByText(/belum punya akun/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /daftar gratis/i })).toBeInTheDocument();
  });

  it('should update email input when user types', async () => {
    const mockOnLogin = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onLogin={mockOnLogin} />);
    const emailInput = screen.getByLabelText(/email/i);

    await user.type(emailInput, 'bisajaya@gmail.com');

    expect(emailInput).toHaveValue('bisajaya@gmail.com');
  });

  it('should update password input when user types', async () => {
    const mockOnLogin = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onLogin={mockOnLogin} />);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(passwordInput, 'qwertyui');

    expect(passwordInput).toHaveValue('qwertyui');
  });

  it('should call onLogin with correct credentials when form is submitted', async () => {
    const mockOnLogin = vi.fn();
    const user = userEvent.setup();

    const credentials = {
      email: 'bisajaya@gmail.com',
      password: 'qwertyui',
    };

    render(<LoginForm onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /masuk sekarang/i });

    await user.type(emailInput, credentials.email);
    await user.type(passwordInput, credentials.password);
    await user.click(submitButton);

    expect(mockOnLogin).toHaveBeenCalledWith(credentials);
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  it('should not call onLogin when email is empty', async () => {
    const mockOnLogin = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onLogin={mockOnLogin} />);

    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /masuk sekarang/i });

    await user.type(passwordInput, 'qwertyui');
    await user.click(submitButton);


    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('should not call onLogin when password is empty', async () => {
    const mockOnLogin = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /masuk sekarang/i });

    await user.type(emailInput, 'bisajaya@gmail.com');
    await user.click(submitButton);

    expect(mockOnLogin).not.toHaveBeenCalled();
  });
});
