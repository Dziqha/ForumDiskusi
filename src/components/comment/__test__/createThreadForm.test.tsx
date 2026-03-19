import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateThreadForm from '../../thread/CreateThreadForm';


describe('CreateThreadForm Component', () => {
  it('should render create button initially', () => {
    const mockOnSubmit = vi.fn();

    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    expect(
      screen.getByText(/apa yang ingin anda diskusikan/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/mulai diskusi baru/i)).not.toBeInTheDocument();
  });

  it('should show form when create button is clicked', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    const createButton = screen.getByText(/apa yang ingin anda diskusikan/i);
    await user.click(createButton);

    expect(screen.getByText(/mulai diskusi baru/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/berikan judul yang menarik/i),
    ).toBeInTheDocument();
  });

  it('should hide form when cancel button is clicked', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    const createButton = screen.getByText(/apa yang ingin anda diskusikan/i);
    await user.click(createButton);

    const cancelButton = screen.getByRole('button', { name: /batal/i });
    await user.click(cancelButton);

    expect(screen.queryByText(/mulai diskusi baru/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/apa yang ingin anda diskusikan/i),
    ).toBeInTheDocument();
  });

  it('should render all form fields correctly', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    const createButton = screen.getByText(/apa yang ingin anda diskusikan/i);
    await user.click(createButton);

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
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    const createButton = screen.getByText(/apa yang ingin anda diskusikan/i);
    await user.click(createButton);

    const titleInput = screen.getByPlaceholderText(
      /berikan judul yang menarik/i,
    );
    await user.type(titleInput, 'My New Thread');

    expect(titleInput).toHaveValue('My New Thread');
  });

  it('should update category input when user types', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    const createButton = screen.getByText(/apa yang ingin anda diskusikan/i);
    await user.click(createButton);

    const categoryInput = screen.getByPlaceholderText(
      /contoh: react, tutorial, news/i,
    );
    await user.type(categoryInput, 'react');

    expect(categoryInput).toHaveValue('react');
  });

  it('should update body textarea when user types', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    render(<CreateThreadForm onSubmit={mockOnSubmit} />);

    const createButton = screen.getByText(/apa yang ingin anda diskusikan/i);
    await user.click(createButton);

    const bodyTextarea = screen.getByPlaceholderText(
      /tuliskan pemikiran anda secara detail/i,
    );
    await user.type(bodyTextarea, 'This is the thread body');

    expect(bodyTextarea).toHaveValue('This is the thread body');
  });

  it('should call onSubmit with correct data when form is submitted', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    const threadData = {
      title: 'Test Thread Title',
      category: 'testing',
      body: 'This is the thread body content',
    };

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

    expect(mockOnSubmit).toHaveBeenCalledWith(threadData);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('should reset form after successful submission', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

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

    expect(titleInputAfter).toHaveValue('');
    expect(categoryInputAfter).toHaveValue('');
    expect(bodyTextareaAfter).toHaveValue('');
  });

  it('should hide form after successful submission', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

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

    expect(screen.queryByText(/mulai diskusi baru/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/apa yang ingin anda diskusikan/i),
    ).toBeInTheDocument();
  });

  it('should not submit when title is empty', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

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

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should not submit when category is empty', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

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

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should not submit when body is empty', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

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

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
