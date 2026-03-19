import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThreadItem from '../ThreadItem';
import { Thread, User } from '@/src/types';

/**
 * Skenario Testing ThreadItem Component
 *
 * - ThreadItem component
 *  - should render thread information correctly
 *    - should display thread title
 *    - should display thread body preview
 *    - should display thread category
 *    - should display owner name and avatar
 *    - should display upvote and downvote counts
 *    - should display total comments
 *  - should handle click on thread title
 *  - should handle upvote when user is authenticated
 *  - should handle downvote when user is authenticated
 *  - should show alert when user not authenticated tries to vote
 *  - should show active upvote state when user has upvoted
 *  - should show active downvote state when user has downvoted
 */

describe('ThreadItem Component', () => {
  const mockThread: Thread = {
    id: 'thread-123',
    title: 'Belajar React Testing Library',
    body: '<p>Ini adalah tutorial tentang cara testing React components dengan Testing Library</p>',
    category: 'react',
    createdAt: '2024-01-01T00:00:00.000Z',
    ownerId: 'user-123',
    upVotesBy: ['user-456', 'user-789'],
    downVotesBy: ['user-111'],
    totalComments: 5,
  };

  const mockOwner: User = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
  };

  const mockAuthUser: User = {
    id: 'user-999',
    name: 'Current User',
    email: 'current@example.com',
    avatar: 'https://example.com/current-avatar.jpg',
  };

  it('should render thread information correctly', () => {
    // Arrange
    const mockOnThreadClick = vi.fn();
    const mockOnUpVote = vi.fn();
    const mockOnDownVote = vi.fn();

    // Action
    render(
      <ThreadItem
        thread={mockThread}
        owner={mockOwner}
        onThreadClick={mockOnThreadClick}
        onUpVote={mockOnUpVote}
        onDownVote={mockOnDownVote}
        authUser={mockAuthUser}
      />,
    );

    // Assert
    expect(
      screen.getByText('Belajar React Testing Library'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Ini adalah tutorial tentang cara testing React components/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // upvote count
    expect(screen.getByText('1')).toBeInTheDocument(); // downvote count
    expect(screen.getByText('5')).toBeInTheDocument(); // total comments
  });

  it('should handle click on thread title', async () => {
    // Arrange
    const mockOnThreadClick = vi.fn();
    const mockOnUpVote = vi.fn();
    const mockOnDownVote = vi.fn();
    const user = userEvent.setup();

    // Action
    render(
      <ThreadItem
        thread={mockThread}
        owner={mockOwner}
        onThreadClick={mockOnThreadClick}
        onUpVote={mockOnUpVote}
        onDownVote={mockOnDownVote}
        authUser={mockAuthUser}
      />,
    );

    const threadTitle = screen.getByText('Belajar React Testing Library');
    await user.click(threadTitle);

    // Assert
    expect(mockOnThreadClick).toHaveBeenCalledWith('thread-123');
    expect(mockOnThreadClick).toHaveBeenCalledTimes(1);
  });

  it('should handle upvote when user is authenticated', async () => {
    // Arrange
    const mockOnThreadClick = vi.fn();
    const mockOnUpVote = vi.fn();
    const mockOnDownVote = vi.fn();
    const user = userEvent.setup();

    // Action
    render(
      <ThreadItem
        thread={mockThread}
        owner={mockOwner}
        onThreadClick={mockOnThreadClick}
        onUpVote={mockOnUpVote}
        onDownVote={mockOnDownVote}
        authUser={mockAuthUser}
      />,
    );

    // Find upvote button (ThumbsUp icon button)
    const buttons = screen.getAllByRole('button');
    const upvoteButton = buttons.find((btn) => btn.textContent?.includes('2'));

    await user.click(upvoteButton!);

    // Assert
    expect(mockOnUpVote).toHaveBeenCalledWith('thread-123');
    expect(mockOnUpVote).toHaveBeenCalledTimes(1);
  });

  it('should handle downvote when user is authenticated', async () => {
    // Arrange
    const mockOnThreadClick = vi.fn();
    const mockOnUpVote = vi.fn();
    const mockOnDownVote = vi.fn();
    const user = userEvent.setup();

    // Action
    render(
      <ThreadItem
        thread={mockThread}
        owner={mockOwner}
        onThreadClick={mockOnThreadClick}
        onUpVote={mockOnUpVote}
        onDownVote={mockOnDownVote}
        authUser={mockAuthUser}
      />,
    );

    // Find downvote button (ThumbsDown icon button)
    const buttons = screen.getAllByRole('button');
    const downvoteButton = buttons.find((btn) =>
      btn.textContent?.includes('1'),
    );

    await user.click(downvoteButton!);

    // Assert
    expect(mockOnDownVote).toHaveBeenCalledWith('thread-123');
    expect(mockOnDownVote).toHaveBeenCalledTimes(1);
  });

  it('should show alert when user not authenticated tries to vote', async () => {
    // Arrange
    const mockOnThreadClick = vi.fn();
    const mockOnUpVote = vi.fn();
    const mockOnDownVote = vi.fn();
    const user = userEvent.setup();

    // Action
    render(
      <ThreadItem
        thread={mockThread}
        owner={mockOwner}
        onThreadClick={mockOnThreadClick}
        onUpVote={mockOnUpVote}
        onDownVote={mockOnDownVote}
        authUser={null}
      />,
    );

    // Try to upvote
    const buttons = screen.getAllByRole('button');
    const upvoteButton = buttons.find((btn) => btn.textContent?.includes('2'));

    await user.click(upvoteButton!);

    // Assert
    expect(alert).toHaveBeenCalledWith('Login untuk vote');
    expect(mockOnUpVote).not.toHaveBeenCalled();
  });

  it('should show active upvote state when user has upvoted', () => {
    // Arrange
    const mockOnThreadClick = vi.fn();
    const mockOnUpVote = vi.fn();
    const mockOnDownVote = vi.fn();

    const threadWithUserUpvote: Thread = {
      ...mockThread,
      upVotesBy: ['user-999'], // Current user has upvoted
    };

    // Action
    render(
      <ThreadItem
        thread={threadWithUserUpvote}
        owner={mockOwner}
        onThreadClick={mockOnThreadClick}
        onUpVote={mockOnUpVote}
        onDownVote={mockOnDownVote}
        authUser={mockAuthUser}
      />,
    );

    // Assert
    const buttons = screen.getAllByRole('button');
    const upvoteButton = buttons.find((btn) => btn.textContent?.includes('1'));

    // Check if button has active styling (text-blue-600)
    expect(upvoteButton).toHaveClass('text-blue-600');
  });

  it('should show active downvote state when user has downvoted', () => {
    // Arrange
    const mockOnThreadClick = vi.fn();
    const mockOnUpVote = vi.fn();
    const mockOnDownVote = vi.fn();

    const threadWithUserDownvote: Thread = {
      ...mockThread,
      downVotesBy: ['user-999'], // Current user has downvoted
      upVotesBy: [],
    };

    // Action
    render(
      <ThreadItem
        thread={threadWithUserDownvote}
        owner={mockOwner}
        onThreadClick={mockOnThreadClick}
        onUpVote={mockOnUpVote}
        onDownVote={mockOnDownVote}
        authUser={mockAuthUser}
      />,
    );

    // Assert
    const buttons = screen.getAllByRole('button');
    const downvoteButton = buttons.find((btn) =>
      btn.textContent?.includes('1'),
    );

    // Check if button has active styling (text-gray-700)
    expect(downvoteButton).toHaveClass('text-gray-700');
  });
  it('should handle undefined owner gracefully and show Unknown', () => {
    // Arrange
    const mockOnThreadClick = vi.fn();
    const mockOnUpVote = vi.fn();
    const mockOnDownVote = vi.fn();

    // Action: Sengaja kita render TANPA mengirimkan data owner (undefined)
    render(
      <ThreadItem
        thread={mockThread}
        owner={undefined} // <-- INI KUNCINYA
        onThreadClick={mockOnThreadClick}
        onUpVote={mockOnUpVote}
        onDownVote={mockOnDownVote}
        authUser={mockAuthUser}
      />,
    );

    // Assert: Pastikan teks 'Unknown' benar-benar muncul di layar
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});
