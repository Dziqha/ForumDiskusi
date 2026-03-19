import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateThreadForm from '../../thread/CreateThreadForm';

/**
 * Skenario Testing CreateThreadForm Component
 *
 * - CreateThreadForm component
 *  - should render create button initially
 *  - should show form when create button is clicked
 *  - should hide form when cancel button is clicked
 *  - should render all form fields correctly
 *    - title input
 *    - category input
 *    - body textarea
 *  - should handle user input correctly
 *    - update title input
 *    - update category input
 *    - update body textarea
 *  - should call onSubmit with correct data when form is submitted
 *  - should reset form after successful submission
 *  - should hide form after successful submission
 *  - should not submit when title is empty
 *  - should not submit when category is empty
 *  - should not submit when body is empty
 */

describe('CreateThreadForm Component', () => {
  it('should render create button initially', () => {
    // Arrange
    const mockOnSubmit = vi.fn();

    // Action
    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    // Assert
    expect(
      screen.getByText(/apa yang ingin anda diskusikan/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/mulai diskusi baru/i)).not.toBeInTheDocument();
  });

  it('should show form when create button is clicked', async () => {
    // Arrange
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    // Action
    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    const createButton = screen.getByText(/apa yang ingin anda diskusikan/i);
    await user.click(createButton);

    // Assert
    expect(screen.getByText(/mulai diskusi baru/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/berikan judul yang menarik/i),
    ).toBeInTheDocument();
  });

  it('should hide form when cancel button is clicked', async () => {
    // Arrange
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    // Action
    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    // Open form
    const createButton = screen.getByText(/apa yang ingin anda diskusikan/i);
    await user.click(createButton);

    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /batal/i });
    await user.click(cancelButton);

    // Assert
    expect(screen.queryByText(/mulai diskusi baru/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/apa yang ingin anda diskusikan/i),
    ).toBeInTheDocument();
  });

  it('should render all form fields correctly', async () => {
    // Arrange
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    // Action
    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    const createButton = screen.getByText(/apa yang ingin anda diskusikan/i);
    await user.click(createButton);

    // Assert
    expect(
      screen.getByPlaceholderText(/berikan judul yang menarik/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/contoh: react, tutorial, news/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/tuliskan pemikiran anda secara detail/i),
    ).toBeInTheDocument();
  });

  it('should update title input when user types', async () => {
    // Arrange
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    // Action
    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    const createButton = screen.getByText(/apa yang ingin anda diskusikan/i);
    await user.click(createButton);

    const titleInput = screen.getByPlaceholderText(
      /berikan judul yang menarik/i,
    );
    await user.type(titleInput, 'My New Thread');

    // Assert
    expect(titleInput).toHaveValue('My New Thread');
  });

  it('should update category input when user types', async () => {
    // Arrange
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    // Action
    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    const createButton = screen.getByText(/apa yang ingin anda diskusikan/i);
    await user.click(createButton);

    const categoryInput = screen.getByPlaceholderText(
      /contoh: react, tutorial, news/i,
    );
    await user.type(categoryInput, 'react');

    // Assert
    expect(categoryInput).toHaveValue('react');
  });

  it('should update body textarea when user types', async () => {
    // Arrange
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    // Action
    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    const createButton = screen.getByText(/apa yang ingin anda diskusikan/i);
    await user.click(createButton);

    const bodyTextarea = screen.getByPlaceholderText(
      /tuliskan pemikiran anda secara detail/i,
    );
    await user.type(bodyTextarea, 'This is the thread body');

    // Assert
    expect(bodyTextarea).toHaveValue('This is the thread body');
  });

  it('should call onSubmit with correct data when form is submitted', async () => {
    // Arrange
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    const threadData = {
      title: 'Test Thread Title',
      category: 'testing',
      body: 'This is the thread body content',
    };

    // Action
    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    const createButton = screen.getByText(/apa yang ingin anda diskusikan/i);
    await user.click(createButton);

    const titleInput = screen.getByPlaceholderText(
      /berikan judul yang menarik/i,
    );
    const categoryInput = screen.getByPlaceholderText(
      /contoh: react, tutorial, news/i,
    );
    const bodyTextarea = screen.getByPlaceholderText(
      /tuliskan pemikiran anda secara detail/i,
    );

    await user.type(titleInput, threadData.title);
    await user.type(categoryInput, threadData.category);
    await user.type(bodyTextarea, threadData.body);

    const submitButton = screen.getByRole('button', {
      name: /terbitkan thread/i,
    });
    await user.click(submitButton);

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith(threadData);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('should reset form after successful submission', async () => {
    // Arrange
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    // Action
    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    const createButton = screen.getByText(/apa yang ingin anda diskusikan/i);
    await user.click(createButton);

    const titleInput = screen.getByPlaceholderText(
      /berikan judul yang menarik/i,
    );
    const categoryInput = screen.getByPlaceholderText(
      /contoh: react, tutorial, news/i,
    );
    const bodyTextarea = screen.getByPlaceholderText(
      /tuliskan pemikiran anda secara detail/i,
    );

    await user.type(titleInput, 'Test Title');
    await user.type(categoryInput, 'test');
    await user.type(bodyTextarea, 'Test Body');

    const submitButton = screen.getByRole('button', {
      name: /terbitkan thread/i,
    });
    await user.click(submitButton);

    // Re-open form to check if fields are cleared
    const createButtonAgain = screen.getByText(
      /apa yang ingin anda diskusikan/i,
    );
    await user.click(createButtonAgain);

    const titleInputAfter = screen.getByPlaceholderText(
      /berikan judul yang menarik/i,
    );
    const categoryInputAfter = screen.getByPlaceholderText(
      /contoh: react, tutorial, news/i,
    );
    const bodyTextareaAfter = screen.getByPlaceholderText(
      /tuliskan pemikiran anda secara detail/i,
    );

    // Assert
    expect(titleInputAfter).toHaveValue('');
    expect(categoryInputAfter).toHaveValue('');
    expect(bodyTextareaAfter).toHaveValue('');
  });

  it('should hide form after successful submission', async () => {
    // Arrange
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    // Action
    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    const createButton = screen.getByText(/apa yang ingin anda diskusikan/i);
    await user.click(createButton);

    const titleInput = screen.getByPlaceholderText(
      /berikan judul yang menarik/i,
    );
    const categoryInput = screen.getByPlaceholderText(
      /contoh: react, tutorial, news/i,
    );
    const bodyTextarea = screen.getByPlaceholderText(
      /tuliskan pemikiran anda secara detail/i,
    );

    await user.type(titleInput, 'Test Title');
    await user.type(categoryInput, 'test');
    await user.type(bodyTextarea, 'Test Body');

    const submitButton = screen.getByRole('button', {
      name: /terbitkan thread/i,
    });
    await user.click(submitButton);

    // Assert
    expect(screen.queryByText(/mulai diskusi baru/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/apa yang ingin anda diskusikan/i),
    ).toBeInTheDocument();
  });

  it('should not submit when title is empty', async () => {
    // Arrange
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    // Action
    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    const createButton = screen.getByText(/apa yang ingin anda diskusikan/i);
    await user.click(createButton);

    const categoryInput = screen.getByPlaceholderText(
      /contoh: react, tutorial, news/i,
    );
    const bodyTextarea = screen.getByPlaceholderText(
      /tuliskan pemikiran anda secara detail/i,
    );

    await user.type(categoryInput, 'test');
    await user.type(bodyTextarea, 'Test Body');

    const submitButton = screen.getByRole('button', {
      name: /terbitkan thread/i,
    });
    await user.click(submitButton);

    // Assert
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should not submit when category is empty', async () => {
    // Arrange
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    // Action
    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    const createButton = screen.getByText(/apa yang ingin anda diskusikan/i);
    await user.click(createButton);

    const titleInput = screen.getByPlaceholderText(
      /berikan judul yang menarik/i,
    );
    const bodyTextarea = screen.getByPlaceholderText(
      /tuliskan pemikiran anda secara detail/i,
    );

    await user.type(titleInput, 'Test Title');
    await user.type(bodyTextarea, 'Test Body');

    const submitButton = screen.getByRole('button', {
      name: /terbitkan thread/i,
    });
    await user.click(submitButton);

    // Assert
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should not submit when body is empty', async () => {
    // Arrange
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    // Action
    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    const createButton = screen.getByText(/apa yang ingin anda diskusikan/i);
    await user.click(createButton);

    const titleInput = screen.getByPlaceholderText(
      /berikan judul yang menarik/i,
    );
    const categoryInput = screen.getByPlaceholderText(
      /contoh: react, tutorial, news/i,
    );

    await user.type(titleInput, 'Test Title');
    await user.type(categoryInput, 'test');

    const submitButton = screen.getByRole('button', {
      name: /terbitkan thread/i,
    });
    await user.click(submitButton);

    // Assert
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
