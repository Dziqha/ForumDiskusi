import { describe, it, expect } from 'vitest';
import authUserReducer from '../authUserReducer';
import { ActionType } from '../../actions/actionTypes';
import { User } from '@/src/types';

/**
 * Skenario Testing authUserReducer
 *
 * - authUserReducer function
 *  - should return initial state when given unknown action
 *  - should return null when given initial state
 *  - should set authUser when given SET_AUTH_USER action
 *  - should return null when given UNSET_AUTH_USER action
 *  - should replace existing authUser when given SET_AUTH_USER action with different user
 */

describe('authUserReducer', () => {
  it('should return initial state when given unknown action', () => {
    // Arrange
    const initialState = null;
    const action = { type: 'UNKNOWN' };

    // Action
    const nextState = authUserReducer(initialState, action);

    // Assert
    expect(nextState).toBeNull();
  });

  it('should return null when given initial state', () => {
    // Arrange
    const initialState = null;
    const action = {};

    // Action
    const nextState = authUserReducer(initialState, action);

    // Assert
    expect(nextState).toBeNull();
  });

  it('should set authUser when given SET_AUTH_USER action', () => {
    // Arrange
    const initialState = null;
    const user: User = {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg',
    };

    const action = {
      type: ActionType.SET_AUTH_USER,
      payload: { authUser: user },
    };

    // Action
    const nextState = authUserReducer(initialState, action);

    // Assert
    expect(nextState).toEqual(user);
    expect(nextState?.id).toBe('user-123');
    expect(nextState?.name).toBe('John Doe');
    expect(nextState?.email).toBe('john@example.com');
  });

  it('should return null when given UNSET_AUTH_USER action', () => {
    // Arrange
    const initialState: User = {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg',
    };

    const action = {
      type: ActionType.UNSET_AUTH_USER,
    };

    // Action
    const nextState = authUserReducer(initialState, action);

    // Assert
    expect(nextState).toBeNull();
  });

  it('should replace existing authUser when given SET_AUTH_USER action with different user', () => {
    // Arrange
    const initialState: User = {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg',
    };

    const newUser: User = {
      id: 'user-456',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://example.com/avatar2.jpg',
    };

    const action = {
      type: ActionType.SET_AUTH_USER,
      payload: { authUser: newUser },
    };

    // Action
    const nextState = authUserReducer(initialState, action);

    // Assert
    expect(nextState).toEqual(newUser);
    expect(nextState?.id).toBe('user-456');
    expect(nextState?.name).toBe('Jane Smith');
    expect(nextState).not.toEqual(initialState);
  });
});
