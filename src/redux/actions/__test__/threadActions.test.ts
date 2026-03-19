import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { asyncAddThread, asyncPopulateUsersAndThreads, asyncReceiveThreadDetail } from '../threadActions';
import { api } from '@/src/lib/api';


vi.mock('@/src/lib/api', () => ({
  api: {
    createThread: vi.fn(),
    getAllUsers: vi.fn(),
    getThreads: vi.fn(),
    getThreadDetail: vi.fn(),
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

    vi.mocked(localStorage.getItem).mockReturnValue(mockToken);
    vi.mocked(api.createThread).mockResolvedValue(mockThread);

    const dispatch = vi.fn();

    const thunk = asyncAddThread(threadData);
    await thunk(dispatch);

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

    expect(dispatch).toHaveBeenCalledTimes(3);
  });

  it('should show alert when token not found', async () => {
    const threadData = {
      title: 'Test Thread',
      body: 'This is test thread body',
      category: 'react',
    };

    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const dispatch = vi.fn();

    const thunk = asyncAddThread(threadData);
    await thunk(dispatch);

    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(alert).toHaveBeenCalledWith('Token tidak ditemukan');

    expect(api.createThread).not.toHaveBeenCalled();

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: false },
    });
  });

  it('should show alert when API call fails', async () => {
    const mockToken = 'mock-token-12345';
    const threadData = {
      title: 'Test Thread',
      body: 'This is test thread body',
      category: 'react',
    };

    const errorMessage = 'Failed to create thread';

    vi.mocked(localStorage.getItem).mockReturnValue(mockToken);
    vi.mocked(api.createThread).mockRejectedValue(new Error(errorMessage));

    const dispatch = vi.fn();

    const thunk = asyncAddThread(threadData);
    await thunk(dispatch);

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

    const thunk = asyncPopulateUsersAndThreads();
    await thunk(dispatch);

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
    const errorMessage = 'Failed to fetch data';
    vi.mocked(api.getAllUsers).mockRejectedValue(new Error(errorMessage));
    const dispatch = vi.fn();

    const thunk = asyncPopulateUsersAndThreads();
    await thunk(dispatch);

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
      ownerId: 'user-1',
      totalComments: 0,
    };

    vi.mocked(api.getThreadDetail).mockResolvedValue(mockThreadDetail);
    const dispatch = vi.fn();

    const thunk = asyncReceiveThreadDetail(mockThreadId);
    await thunk(dispatch);

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
    const mockThreadId = 'thread-1';
    const errorMessage = 'Thread not found';

    vi.mocked(api.getThreadDetail).mockRejectedValue(new Error(errorMessage));
    const dispatch = vi.fn();

    const thunk = asyncReceiveThreadDetail(mockThreadId);
    await thunk(dispatch);

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