/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { asyncSetAuthUser, asyncRegisterUser, asyncPreloadProcess, asyncUnsetAuthUser } from '../authActions';
import { api } from '@/src/lib/api';


vi.mock('@/src/lib/api', () => ({
  api: {
    login: vi.fn(),
    getOwnProfile: vi.fn(),
    register: vi.fn(),
  },
}));

describe('asyncSetAuthUser thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should dispatch actions correctly when login successful', async () => {
    const mockToken = 'mock-token-12345';
    const mockUser = {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg',
    };

    const credentials = {
      email: 'john@example.com',
      password: 'password123',
    };

    vi.mocked(api.login).mockResolvedValue(mockToken);
    vi.mocked(api.getOwnProfile).mockResolvedValue(mockUser);

    const dispatch = vi.fn();

    const thunk = asyncSetAuthUser(credentials);
    const result = await thunk(dispatch);

    expect(api.login).toHaveBeenCalledWith(
      credentials.email,
      credentials.password,
    );
    expect(api.login).toHaveBeenCalledTimes(1);

    expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);

    expect(api.getOwnProfile).toHaveBeenCalledWith(mockToken);
    expect(api.getOwnProfile).toHaveBeenCalledTimes(1);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: true },
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_AUTH_USER',
      payload: { authUser: mockUser },
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: false },
    });

    expect(result).toEqual(mockUser);
  });

  it('should handle login failure correctly', async () => {
    const credentials = {
      email: 'wrong@example.com',
      password: 'wrongpassword',
    };

    const errorMessage = 'Email or password is wrong';

    vi.mocked(api.login).mockRejectedValue(new Error(errorMessage));

    const dispatch = vi.fn();

    const thunk = asyncSetAuthUser(credentials);

    await expect(thunk(dispatch)).rejects.toThrow(errorMessage);

    expect(api.login).toHaveBeenCalledWith(
      credentials.email,
      credentials.password,
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

    expect(api.getOwnProfile).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SET_AUTH_USER',
      }),
    );
  });
});

describe('asyncRegisterUser thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should dispatch actions correctly when register is successful', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };
    vi.mocked(api.register).mockResolvedValue(undefined as any);
    const dispatch = vi.fn();

    const thunk = asyncRegisterUser(userData);
    await thunk(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: true },
    });
    expect(api.register).toHaveBeenCalledWith(
      userData.name,
      userData.email,
      userData.password,
    );
    expect(window.alert).toHaveBeenCalledWith(
      'Registrasi berhasil! Silakan login.',
    );
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: false },
    });
  });

  it('should handle register failure correctly', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };
    const errorMessage = 'Email sudah digunakan';
    vi.mocked(api.register).mockRejectedValue(new Error(errorMessage));
    const dispatch = vi.fn();

    const thunk = asyncRegisterUser(userData);
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

describe('asyncPreloadProcess thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null and not call API if token does not exist', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    const dispatch = vi.fn();

    const thunk = asyncPreloadProcess();
    const result = await thunk(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: true },
    });
    expect(api.getOwnProfile).not.toHaveBeenCalled();
    expect(result).toBeNull();
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: false },
    });
  });

  it('should dispatch setAuthUser and return user if token is valid', async () => {
    const mockToken = 'valid-token';
    const mockUser = {
      id: 'user-1',
      name: 'John',
      email: 'john@example.com',
      avatar: 'img.jpg',
    };

    vi.mocked(localStorage.getItem).mockReturnValue(mockToken);
    vi.mocked(api.getOwnProfile).mockResolvedValue(mockUser);
    const dispatch = vi.fn();

    const thunk = asyncPreloadProcess();
    const result = await thunk(dispatch);

    expect(api.getOwnProfile).toHaveBeenCalledWith(mockToken);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_AUTH_USER',
      payload: { authUser: mockUser },
    });
    expect(result).toEqual(mockUser);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: false },
    });
  });

  it('should dispatch unsetAuthUser and remove token if getOwnProfile fails', async () => {
    const mockToken = 'invalid-token';

    vi.mocked(localStorage.getItem).mockReturnValue(mockToken);
    vi.mocked(api.getOwnProfile).mockRejectedValue(new Error('Invalid token'));
    const dispatch = vi.fn();

    const thunk = asyncPreloadProcess();
    const result = await thunk(dispatch);

    expect(dispatch).toHaveBeenCalledWith({ type: 'UNSET_AUTH_USER' });
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(result).toBeNull();
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: false },
    });
  });
});

describe('asyncUnsetAuthUser thunk', () => {
  it('should remove token and dispatch unsetAuthUser', () => {
    const dispatch = vi.fn();

    const thunk = asyncUnsetAuthUser();
    const result = thunk(dispatch);

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(dispatch).toHaveBeenCalledWith({ type: 'UNSET_AUTH_USER' });
    expect(result).toBe(true);
  });
});
