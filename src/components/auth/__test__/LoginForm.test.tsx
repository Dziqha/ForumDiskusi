import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../LoginForm';

/**
 * Skenario Testing LoginForm Component
 *
 * - LoginForm component
 *  - should render login form correctly
 *    - should display email input field
 *    - should display password input field
 *    - should display submit button
 *    - should display link to register page
 *  - should handle user input correctly
 *    - should update email input when user types
 *    - should update password input when user types
 *  - should call onLogin with correct credentials when form is submitted
 *  - should not call onLogin when email is empty
 *  - should not call onLogin when password is empty
 */

describe('LoginForm Component', () => {
  it('should render login form correctly', () => {
    // Arrange
    const mockOnLogin = vi.fn();

    // Action
    render(<LoginForm onLogin={mockOnLogin} />);

    // Assert
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /masuk sekarang/i })).toBeInTheDocument();
    expect(screen.getByText(/belum punya akun/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /daftar gratis/i })).toBeInTheDocument();
  });

  it('should update email input when user types', async () => {
    // Arrange
    const mockOnLogin = vi.fn();
    const user = userEvent.setup();

    // Action
    render(<LoginForm onLogin={mockOnLogin} />);
    const emailInput = screen.getByLabelText(/email/i);

    await user.type(emailInput, 'bisajaya@gmail.com');

    // Assert
    expect(emailInput).toHaveValue('bisajaya@gmail.com');
  });

  it('should update password input when user types', async () => {
    // Arrange
    const mockOnLogin = vi.fn();
    const user = userEvent.setup();

    // Action
    render(<LoginForm onLogin={mockOnLogin} />);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(passwordInput, 'qwertyui');

    // Assert
    expect(passwordInput).toHaveValue('qwertyui');
  });

  it('should call onLogin with correct credentials when form is submitted', async () => {
    // Arrange
    const mockOnLogin = vi.fn();
    const user = userEvent.setup();

    const credentials = {
      email: 'bisajaya@gmail.com',
      password: 'qwertyui',
    };

    // Action
    render(<LoginForm onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /masuk sekarang/i });

    await user.type(emailInput, credentials.email);
    await user.type(passwordInput, credentials.password);
    await user.click(submitButton);

    // Assert
    expect(mockOnLogin).toHaveBeenCalledWith(credentials);
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  it('should not call onLogin when email is empty', async () => {
    // Arrange
    const mockOnLogin = vi.fn();
    const user = userEvent.setup();

    // Action
    render(<LoginForm onLogin={mockOnLogin} />);

    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /masuk sekarang/i });

    await user.type(passwordInput, 'qwertyui');
    await user.click(submitButton);

    // Assert
    // Form validation should prevent submission
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('should not call onLogin when password is empty', async () => {
    // Arrange
    const mockOnLogin = vi.fn();
    const user = userEvent.setup();

    // Action
    render(<LoginForm onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /masuk sekarang/i });

    await user.type(emailInput, 'bisajaya@gmail.com');
    await user.click(submitButton);

    // Assert
    // Form validation should prevent submission
    expect(mockOnLogin).not.toHaveBeenCalled();
  });
});
