/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { asyncSetAuthUser, asyncRegisterUser, asyncPreloadProcess, asyncUnsetAuthUser } from '../authActions';
import { api } from '@/src/lib/api';

/**
 * Skenario Testing asyncSetAuthUser thunk
 *
 * - asyncSetAuthUser thunk
 *  - should dispatch actions correctly when login successful
 *    - should call api.login with correct credentials
 *    - should save token to localStorage
 *    - should call api.getOwnProfile with token
 *    - should dispatch setAuthUserActionCreator with user data
 *    - should dispatch setLoadingActionCreator with false at the end
 *    - should return user data
 *  - should handle login failure correctly
 *    - should call api.login with credentials
 *    - should show alert with error message
 *    - should dispatch setLoadingActionCreator with false
 *    - should throw error
 */

// Mock the api module
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
    // Arrange
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

    // Mock API responses
    vi.mocked(api.login).mockResolvedValue(mockToken);
    vi.mocked(api.getOwnProfile).mockResolvedValue(mockUser);

    // Mock dispatch
    const dispatch = vi.fn();

    // Action
    const thunk = asyncSetAuthUser(credentials);
    const result = await thunk(dispatch);

    // Assert
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
    // Arrange
    const credentials = {
      email: 'wrong@example.com',
      password: 'wrongpassword',
    };

    const errorMessage = 'Email or password is wrong';

    // Mock API to reject
    vi.mocked(api.login).mockRejectedValue(new Error(errorMessage));

    // Mock dispatch
    const dispatch = vi.fn();

    // Action & Assert
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

    // Should NOT call getOwnProfile or setAuthUser when login fails
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
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };
    vi.mocked(api.register).mockResolvedValue(undefined as any);
    const dispatch = vi.fn();

    // Action
    const thunk = asyncRegisterUser(userData);
    await thunk(dispatch);

    // Assert
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
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };
    const errorMessage = 'Email sudah digunakan';
    vi.mocked(api.register).mockRejectedValue(new Error(errorMessage));
    const dispatch = vi.fn();

    // Action
    const thunk = asyncRegisterUser(userData);
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

describe('asyncPreloadProcess thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null and not call API if token does not exist', async () => {
    // Arrange
    vi.mocked(localStorage.getItem).mockReturnValue(null); // <-- Paksa mock mengembalikan null
    const dispatch = vi.fn();

    // Action
    const thunk = asyncPreloadProcess();
    const result = await thunk(dispatch);

    // Assert
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
    // Arrange
    const mockToken = 'valid-token';
    const mockUser = {
      id: 'user-1',
      name: 'John',
      email: 'john@example.com',
      avatar: 'img.jpg',
    };

    vi.mocked(localStorage.getItem).mockReturnValue(mockToken); // <-- Paksa mock mengembalikan token valid
    vi.mocked(api.getOwnProfile).mockResolvedValue(mockUser);
    const dispatch = vi.fn();

    // Action
    const thunk = asyncPreloadProcess();
    const result = await thunk(dispatch);

    // Assert
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
    // Arrange
    const mockToken = 'invalid-token';

    vi.mocked(localStorage.getItem).mockReturnValue(mockToken); // <-- Paksa mock mengembalikan token
    vi.mocked(api.getOwnProfile).mockRejectedValue(new Error('Invalid token'));
    const dispatch = vi.fn();

    // Action
    const thunk = asyncPreloadProcess();
    const result = await thunk(dispatch);

    // Assert
    expect(dispatch).toHaveBeenCalledWith({ type: 'UNSET_AUTH_USER' });
    expect(localStorage.removeItem).toHaveBeenCalledWith('token'); // <-- Cek apakah removeItem dipanggil
    expect(result).toBeNull();
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_LOADING',
      payload: { isLoading: false },
    });
  });
});

describe('asyncUnsetAuthUser thunk', () => {
  it('should remove token and dispatch unsetAuthUser', () => {
    // Arrange
    const dispatch = vi.fn();

    // Action
    const thunk = asyncUnsetAuthUser();
    const result = thunk(dispatch);

    // Assert
    expect(localStorage.removeItem).toHaveBeenCalledWith('token'); // <-- Cek apakah removeItem dipanggil
    expect(dispatch).toHaveBeenCalledWith({ type: 'UNSET_AUTH_USER' });
    expect(result).toBe(true);
  });
});
