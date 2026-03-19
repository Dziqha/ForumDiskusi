import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { asyncAddThread, asyncPopulateUsersAndThreads, asyncReceiveThreadDetail } from '../threadActions';
import { api } from '@/src/lib/api';

/**
 * Skenario Testing asyncAddThread thunk
 *
 * - asyncAddThread thunk
 *  - should dispatch actions correctly when create thread successful
 *    - should get token from localStorage
 *    - should call api.createThread with correct parameters
 *    - should dispatch addThreadActionCreator with thread data
 *    - should dispatch setLoadingActionCreator twice (true then false)
 *  - should handle create thread failure correctly
 *    - should show alert when token not found
 *    - should show alert when API call fails
 *    - should dispatch setLoadingActionCreator with false
 */

// Mock the api module
vi.mock('@/src/lib/api', () => ({
  api: {
    createThread: vi.fn(),
    getAllUsers: vi.fn(), // <-- Tambahkan ini
    getThreads: vi.fn(), // <-- Tambahkan ini
    getThreadDetail: vi.fn(), // <-- Tambahkan ini
  },
}));

describe('asyncAddThread thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should dispatch actions correctly when create thread successful', async () => {
    // Arrange
    const mockToken = 'mock-token-12345';
    const mockThread = {
      id: 'thread-123',
      title: 'Test Thread',
      body: 'This is test thread body',
      category: 'react',
      createdAt: '2024-01-01T00:00:00.000Z',
      ownerId: 'user-123',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 0,
    };

    const threadData = {
      title: 'Test Thread',
      body: 'This is test thread body',
      category: 'react',
    };

    // Mock localStorage
    vi.mocked(localStorage.getItem).mockReturnValue(mockToken);

    // Mock API response
    vi.mocked(api.createThread).mockResolvedValue(mockThread);

    // Mock dispatch
    const dispatch = vi.fn();

    // Action
    const thunk = asyncAddThread(threadData);
    await thunk(dispatch);

    // Assert
    expect(localStorage.getItem).toHaveBeenCalledWith('token');

    expect(api.createThread).toHaveBeenCalledWith(
      threadData.title,
      threadData.body,
      threadData.category,
      mockToken,
    );
    expect(api.createThread).toHaveBeenCalledTimes(1);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: true },
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'ADD_THREAD',
      payload: { thread: mockThread },
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: false },
    });

    // Check dispatch was called at least 3 times (loading true, add thread, loading false)
    expect(dispatch).toHaveBeenCalledTimes(3);
  });

  it('should show alert when token not found', async () => {
    // Arrange
    const threadData = {
      title: 'Test Thread',
      body: 'This is test thread body',
      category: 'react',
    };

    // Mock localStorage to return null
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    // Mock dispatch
    const dispatch = vi.fn();

    // Action
    const thunk = asyncAddThread(threadData);
    await thunk(dispatch);

    // Assert
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(alert).toHaveBeenCalledWith('Token tidak ditemukan');

    expect(api.createThread).not.toHaveBeenCalled();

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: false },
    });
  });

  it('should show alert when API call fails', async () => {
    // Arrange
    const mockToken = 'mock-token-12345';
    const threadData = {
      title: 'Test Thread',
      body: 'This is test thread body',
      category: 'react',
    };

    const errorMessage = 'Failed to create thread';

    // Mock localStorage
    vi.mocked(localStorage.getItem).mockReturnValue(mockToken);

    // Mock API to reject
    vi.mocked(api.createThread).mockRejectedValue(new Error(errorMessage));

    // Mock dispatch
    const dispatch = vi.fn();

    // Action
    const thunk = asyncAddThread(threadData);
    await thunk(dispatch);

    // Assert
    expect(api.createThread).toHaveBeenCalledWith(
      threadData.title,
      threadData.body,
      threadData.category,
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

    // Should NOT dispatch ADD_THREAD when API fails
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ADD_THREAD',
      }),
    );
  });
});

describe('asyncPopulateUsersAndThreads thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should dispatch actions correctly when fetching data is successful', async () => {
    // Arrange
    const mockUsers = [
      {
        id: 'user-1',
        name: 'User 1',
        email: 'user1@email.com',
        avatar: 'img1.jpg',
      },
    ];
    const mockThreads = [
      {
        id: 'thread-1',
        title: 'Thread 1',
        body: 'Body 1',
        category: 'Cat',
        createdAt: '',
        ownerId: 'user-1',
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 0,
      },
    ];

    vi.mocked(api.getAllUsers).mockResolvedValue(mockUsers);
    vi.mocked(api.getThreads).mockResolvedValue(mockThreads);
    const dispatch = vi.fn();

    // Action
    const thunk = asyncPopulateUsersAndThreads();
    await thunk(dispatch);

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: true },
    });
    expect(api.getAllUsers).toHaveBeenCalledTimes(1);
    expect(api.getThreads).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_USERS',
      payload: { users: mockUsers },
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_THREADS',
      payload: { threads: mockThreads },
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: false },
    });
  });

  it('should handle fetching data failure correctly', async () => {
    // Arrange
    const errorMessage = 'Failed to fetch data';
    vi.mocked(api.getAllUsers).mockRejectedValue(new Error(errorMessage));
    // Kita biarkan getThreads tidak di-mock spesifik karena Promise.all akan gagal jika salah satu gagal
    const dispatch = vi.fn();

    // Action
    const thunk = asyncPopulateUsersAndThreads();
    await thunk(dispatch);

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: true },
    });
    expect(window.alert).toHaveBeenCalledWith(errorMessage);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: false },
    });
  });
});

describe('asyncReceiveThreadDetail thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should dispatch actions correctly when fetching thread detail is successful', async () => {
    // Arrange
    const mockThreadId = 'thread-1';
    const mockThreadDetail = {
      id: 'thread-1',
      title: 'Thread 1',
      body: 'Body 1',
      category: 'Cat',
      createdAt: '',
      owner: {
        id: 'user-1',
        name: 'User',
        email: 'user@example.com',
        avatar: '',
      },
      upVotesBy: [],
      downVotesBy: [],
      comments: [],
      ownerId: 'user-1', // <-- Tambahkan ini
      totalComments: 0,
    };

    vi.mocked(api.getThreadDetail).mockResolvedValue(mockThreadDetail);
    const dispatch = vi.fn();

    // Action
    const thunk = asyncReceiveThreadDetail(mockThreadId);
    await thunk(dispatch);

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: true },
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_THREAD_DETAIL',
      payload: { threadDetail: null },
    });
    expect(api.getThreadDetail).toHaveBeenCalledWith(mockThreadId);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_THREAD_DETAIL',
      payload: { threadDetail: mockThreadDetail },
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: false },
    });
  });

  it('should handle fetching thread detail failure correctly', async () => {
    // Arrange
    const mockThreadId = 'thread-1';
    const errorMessage = 'Thread not found';

    vi.mocked(api.getThreadDetail).mockRejectedValue(new Error(errorMessage));
    const dispatch = vi.fn();

    // Action
    const thunk = asyncReceiveThreadDetail(mockThreadId);
    await thunk(dispatch);

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: true },
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_THREAD_DETAIL',
      payload: { threadDetail: null },
    });
    expect(window.alert).toHaveBeenCalledWith(errorMessage);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: false },
    });
  });
});