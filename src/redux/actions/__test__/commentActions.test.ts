import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { asyncAddComment } from '../commentActions';
import { api } from '@/src/lib/api';

/**
 * Skenario Testing asyncAddComment thunk
 *
 * - asyncAddComment thunk
 *  - should dispatch actions correctly when add comment successful
 *    - should get token from localStorage
 *    - should call api.createComment with correct parameters
 *    - should dispatch addCommentActionCreator with comment data
 *    - should dispatch setLoadingActionCreator twice
 *  - should handle add comment failure when token not found
 *  - should handle add comment failure when API call fails
 *  - should validate threadId parameter
 *  - should validate content parameter
 */

// Mock the api module
vi.mock('@/src/lib/api', () => ({
  api: {
    createComment: vi.fn(),
  },
}));

describe('asyncAddComment thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should dispatch actions correctly when add comment successful', async () => {
    // Arrange
    const mockToken = 'mock-token-12345';
    const mockComment = {
      id: 'comment-123',
      content: 'This is a test comment',
      createdAt: '2024-01-01T00:00:00.000Z',
      owner: {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.jpg',
      },
      upVotesBy: [],
      downVotesBy: [],
    };

    const commentData = {
      threadId: 'thread-123',
      content: 'This is a test comment',
    };

    // Mock localStorage
    vi.mocked(localStorage.getItem).mockReturnValue(mockToken);

    // Mock API response
    vi.mocked(api.createComment).mockResolvedValue(mockComment);

    // Mock dispatch
    const dispatch = vi.fn();

    // Action
    const thunk = asyncAddComment(commentData);
    await thunk(dispatch);

    // Assert
    expect(localStorage.getItem).toHaveBeenCalledWith('token');

    expect(api.createComment).toHaveBeenCalledWith(
      commentData.threadId,
      commentData.content,
      mockToken,
    );
    expect(api.createComment).toHaveBeenCalledTimes(1);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: true },
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'ADD_COMMENT',
      payload: { comment: mockComment },
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: false },
    });

    expect(dispatch).toHaveBeenCalledTimes(3);
  });

  it('should handle add comment failure when token not found', async () => {
    // Arrange
    const commentData = {
      threadId: 'thread-123',
      content: 'Test comment',
    };

    // Mock localStorage to return null
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    // Mock dispatch
    const dispatch = vi.fn();

    // Action
    const thunk = asyncAddComment(commentData);
    await thunk(dispatch);

    // Assert
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(alert).toHaveBeenCalledWith('Token tidak ditemukan');

    expect(api.createComment).not.toHaveBeenCalled();

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: false },
    });
  });

  it('should handle add comment failure when API call fails', async () => {
    // Arrange
    const mockToken = 'mock-token-12345';
    const commentData = {
      threadId: 'thread-123',
      content: 'Test comment',
    };

    const errorMessage = 'Failed to create comment';

    // Mock localStorage
    vi.mocked(localStorage.getItem).mockReturnValue(mockToken);

    // Mock API to reject
    vi.mocked(api.createComment).mockRejectedValue(new Error(errorMessage));

    // Mock dispatch
    const dispatch = vi.fn();

    // Action
    const thunk = asyncAddComment(commentData);
    await thunk(dispatch);

    // Assert
    expect(api.createComment).toHaveBeenCalledWith(
      commentData.threadId,
      commentData.content,
      mockToken,
    );

    expect(alert).toHaveBeenCalledWith(errorMessage);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: true },
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: false },
    });

    // Should NOT dispatch ADD_COMMENT when API fails
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ADD_COMMENT',
      }),
    );
  });

  it('should validate threadId parameter', async () => {
    // Arrange
    const mockToken = 'mock-token-12345';
    const mockComment = {
      id: 'comment-123',
      content: 'Test comment',
      createdAt: '2024-01-01T00:00:00.000Z',
      owner: {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.jpg',
      },
      upVotesBy: [],
      downVotesBy: [],
    };

    const commentData = {
      threadId: 'specific-thread-id',
      content: 'Test comment',
    };

    // Mock localStorage
    vi.mocked(localStorage.getItem).mockReturnValue(mockToken);

    // Mock API response
    vi.mocked(api.createComment).mockResolvedValue(mockComment);

    // Mock dispatch
    const dispatch = vi.fn();

    // Action
    const thunk = asyncAddComment(commentData);
    await thunk(dispatch);

    // Assert
    expect(api.createComment).toHaveBeenCalledWith(
      'specific-thread-id',
      expect.any(String),
      expect.any(String),
    );
  });

  it('should validate content parameter', async () => {
    // Arrange
    const mockToken = 'mock-token-12345';
    const mockComment = {
      id: 'comment-123',
      content: 'Specific content here',
      createdAt: '2024-01-01T00:00:00.000Z',
      owner: {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.jpg',
      },
      upVotesBy: [],
      downVotesBy: [],
    };

    const commentData = {
      threadId: 'thread-123',
      content: 'Specific content here',
    };

    // Mock localStorage
    vi.mocked(localStorage.getItem).mockReturnValue(mockToken);

    // Mock API response
    vi.mocked(api.createComment).mockResolvedValue(mockComment);

    // Mock dispatch
    const dispatch = vi.fn();

    // Action
    const thunk = asyncAddComment(commentData);
    await thunk(dispatch);

    // Assert
    expect(api.createComment).toHaveBeenCalledWith(
      expect.any(String),
      'Specific content here',
      expect.any(String),
    );
  });
});
