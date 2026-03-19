/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import threadsReducer from '../threadsReducer';
import { ActionType } from '../../actions/actionTypes';
import { Thread } from '@/src/types';

/**
 * Skenario Testing threadsReducer
 *
 * - threadsReducer function
 *  - should return initial state when given unknown action
 *  - should return threads when given SET_THREADS action
 *  - should add new thread at the beginning when given ADD_THREAD action
 *  - should toggle upvote correctly when given TOGGLE_UPVOTE_THREAD action
 *    - should add userId to upVotesBy when not upvoted yet
 *    - should remove userId from upVotesBy when already upvoted
 *    - should remove userId from downVotesBy when toggling upvote
 *  - should toggle downvote correctly when given TOGGLE_DOWNVOTE_THREAD action
 *    - should add userId to downVotesBy when not downvoted yet
 *    - should remove userId from downVotesBy when already downvoted
 *    - should remove userId from upVotesBy when toggling downvote
 */

describe('threadsReducer', () => {
  it('should return initial state when given unknown action', () => {
    // Arrange
    const initialState: Thread[] = [];
    const action = { type: 'UNKNOWN' };

    // Action
    const nextState = threadsReducer(initialState, action);

    // Assert
    expect(nextState).toEqual(initialState);
  });

  it('should return threads when given SET_THREADS action', () => {
    // Arrange
    const initialState: Thread[] = [];
    const action = {
      type: ActionType.SET_THREADS,
      payload: {
        threads: [
          {
            id: 'thread-1',
            title: 'Thread Test 1',
            body: 'Body thread test 1',
            category: 'react',
            createdAt: '2024-01-01',
            ownerId: 'user-1',
            upVotesBy: [],
            downVotesBy: [],
            totalComments: 0,
          },
          {
            id: 'thread-2',
            title: 'Thread Test 2',
            body: 'Body thread test 2',
            category: 'redux',
            createdAt: '2024-01-02',
            ownerId: 'user-2',
            upVotesBy: [],
            downVotesBy: [],
            totalComments: 0,
          },
        ],
      },
    };

    // Action
    const nextState = threadsReducer(initialState, action);

    // Assert
    expect(nextState).toEqual(action.payload.threads);
    expect(nextState).toHaveLength(2);
  });

  it('should add new thread at the beginning when given ADD_THREAD action', () => {
    // Arrange
    const initialState: Thread[] = [
      {
        id: 'thread-1',
        title: 'Thread Test 1',
        body: 'Body thread test 1',
        category: 'react',
        createdAt: '2024-01-01',
        ownerId: 'user-1',
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 0,
      },
    ];

    const newThread: Thread = {
      id: 'thread-2',
      title: 'Thread Test 2',
      body: 'Body thread test 2',
      category: 'redux',
      createdAt: '2024-01-02',
      ownerId: 'user-2',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 0,
    };

    const action = {
      type: ActionType.ADD_THREAD,
      payload: { thread: newThread },
    };

    // Action
    const nextState = threadsReducer(initialState, action);

    // Assert
    expect(nextState).toHaveLength(2);
    expect(nextState[0]).toEqual(newThread);
    expect(nextState[1]).toEqual(initialState[0]);
  });

  it('should add userId to upVotesBy when not upvoted yet', () => {
    // Arrange
    const initialState: Thread[] = [
      {
        id: 'thread-1',
        title: 'Thread Test 1',
        body: 'Body thread test 1',
        category: 'react',
        createdAt: '2024-01-01',
        ownerId: 'user-1',
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 0,
      },
    ];

    const action = {
      type: ActionType.TOGGLE_UPVOTE_THREAD,
      payload: {
        threadId: 'thread-1',
        userId: 'user-2',
        isUpVoted: false,
      },
    };

    // Action
    const nextState = threadsReducer(initialState, action);

    // Assert
    expect(nextState[0].upVotesBy).toContain('user-2');
    expect(nextState[0].upVotesBy).toHaveLength(1);
  });

  it('should remove userId from upVotesBy when already upvoted', () => {
    // Arrange
    const initialState: Thread[] = [
      {
        id: 'thread-1',
        title: 'Thread Test 1',
        body: 'Body thread test 1',
        category: 'react',
        createdAt: '2024-01-01',
        ownerId: 'user-1',
        upVotesBy: ['user-2'],
        downVotesBy: [],
        totalComments: 0,
      },
    ];

    const action = {
      type: ActionType.TOGGLE_UPVOTE_THREAD,
      payload: {
        threadId: 'thread-1',
        userId: 'user-2',
        isUpVoted: true,
      },
    };

    // Action
    const nextState = threadsReducer(initialState, action);

    // Assert
    expect(nextState[0].upVotesBy).not.toContain('user-2');
    expect(nextState[0].upVotesBy).toHaveLength(0);
  });

  it('should remove userId from downVotesBy when toggling upvote', () => {
    // Arrange
    const initialState: Thread[] = [
      {
        id: 'thread-1',
        title: 'Thread Test 1',
        body: 'Body thread test 1',
        category: 'react',
        createdAt: '2024-01-01',
        ownerId: 'user-1',
        upVotesBy: [],
        downVotesBy: ['user-2'],
        totalComments: 0,
      },
    ];

    const action = {
      type: ActionType.TOGGLE_UPVOTE_THREAD,
      payload: {
        threadId: 'thread-1',
        userId: 'user-2',
        isUpVoted: false,
      },
    };

    // Action
    const nextState = threadsReducer(initialState, action);

    // Assert
    expect(nextState[0].upVotesBy).toContain('user-2');
    expect(nextState[0].downVotesBy).not.toContain('user-2');
    expect(nextState[0].downVotesBy).toHaveLength(0);
  });

  it('should add userId to downVotesBy when not downvoted yet', () => {
    // Arrange
    const initialState: Thread[] = [
      {
        id: 'thread-1',
        title: 'Thread Test 1',
        body: 'Body thread test 1',
        category: 'react',
        createdAt: '2024-01-01',
        ownerId: 'user-1',
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 0,
      },
    ];

    const action = {
      type: ActionType.TOGGLE_DOWNVOTE_THREAD,
      payload: {
        threadId: 'thread-1',
        userId: 'user-2',
        isDownVoted: false,
      },
    };

    // Action
    const nextState = threadsReducer(initialState, action);

    // Assert
    expect(nextState[0].downVotesBy).toContain('user-2');
    expect(nextState[0].downVotesBy).toHaveLength(1);
  });

  it('should remove userId from downVotesBy when already downvoted', () => {
    // Arrange
    const initialState: Thread[] = [
      {
        id: 'thread-1',
        title: 'Thread Test 1',
        body: 'Body thread test 1',
        category: 'react',
        createdAt: '2024-01-01',
        ownerId: 'user-1',
        upVotesBy: [],
        downVotesBy: ['user-2'],
        totalComments: 0,
      },
    ];

    const action = {
      type: ActionType.TOGGLE_DOWNVOTE_THREAD,
      payload: {
        threadId: 'thread-1',
        userId: 'user-2',
        isDownVoted: true,
      },
    };

    // Action
    const nextState = threadsReducer(initialState, action);

    // Assert
    expect(nextState[0].downVotesBy).not.toContain('user-2');
    expect(nextState[0].downVotesBy).toHaveLength(0);
  });

  it('should remove userId from upVotesBy when toggling downvote', () => {
    // Arrange
    const initialState: Thread[] = [
      {
        id: 'thread-1',
        title: 'Thread Test 1',
        body: 'Body thread test 1',
        category: 'react',
        createdAt: '2024-01-01',
        ownerId: 'user-1',
        upVotesBy: ['user-2'],
        downVotesBy: [],
        totalComments: 0,
      },
    ];

    const action = {
      type: ActionType.TOGGLE_DOWNVOTE_THREAD,
      payload: {
        threadId: 'thread-1',
        userId: 'user-2',
        isDownVoted: false,
      },
    };

    // Action
    const nextState = threadsReducer(initialState, action);

    // Assert
    expect(nextState[0].downVotesBy).toContain('user-2');
    expect(nextState[0].upVotesBy).not.toContain('user-2');
    expect(nextState[0].upVotesBy).toHaveLength(0);
  });
});

describe('TOGGLE_UPVOTE_THREAD action', () => {
  it('should toggle upvote a thread properly', () => {
    // PENTING: Kita sediakan 2 thread agar percabangan "return thread;" (tidak cocok ID) ikut dites
    const initialState: any = [
      { id: 'thread-1', upVotesBy: [], downVotesBy: ['user-1'] },
      { id: 'thread-2', upVotesBy: [], downVotesBy: [] },
    ];

    // Skenario 1: Menambah upvote (isUpVoted: false)
    const action1 = {
      type: 'TOGGLE_UPVOTE_THREAD',
      payload: { threadId: 'thread-1', userId: 'user-1', isUpVoted: false },
    };
    const nextState1 = threadsReducer(initialState, action1);

    expect(nextState1[0].upVotesBy).toContain('user-1'); // Upvote bertambah
    expect(nextState1[0].downVotesBy).not.toContain('user-1'); // Downvote dihapus
    expect(nextState1[1]).toEqual(initialState[1]); // Thread ke-2 tidak boleh berubah

    // Skenario 2: Mencabut upvote (isUpVoted: true) -> Ini untuk mengetes fungsi filter
    const action2 = {
      type: 'TOGGLE_UPVOTE_THREAD',
      payload: { threadId: 'thread-1', userId: 'user-1', isUpVoted: true },
    };
    // Kita pakai hasil state 1 sebagai state awal untuk skenario 2
    const nextState2 = threadsReducer(nextState1, action2);
    expect(nextState2[0].upVotesBy).not.toContain('user-1'); // Upvote berhasil dicabut
  });
});

describe('TOGGLE_DOWNVOTE_THREAD action', () => {
  it('should toggle downvote a thread properly', () => {
    const initialState: any = [
      { id: 'thread-1', upVotesBy: ['user-1'], downVotesBy: [] },
      { id: 'thread-2', upVotesBy: [], downVotesBy: [] },
    ];

    // Skenario 1: Menambah downvote (isDownVoted: false)
    const action1 = {
      type: 'TOGGLE_DOWNVOTE_THREAD',
      payload: { threadId: 'thread-1', userId: 'user-1', isDownVoted: false },
    };
    const nextState1 = threadsReducer(initialState, action1);

    expect(nextState1[0].downVotesBy).toContain('user-1'); // Downvote bertambah
    expect(nextState1[0].upVotesBy).not.toContain('user-1'); // Upvote dihapus
    expect(nextState1[1]).toEqual(initialState[1]); // Thread ke-2 aman

    // Skenario 2: Mencabut downvote (isDownVoted: true)
    const action2 = {
      type: 'TOGGLE_DOWNVOTE_THREAD',
      payload: { threadId: 'thread-1', userId: 'user-1', isDownVoted: true },
    };
    const nextState2 = threadsReducer(nextState1, action2);
    expect(nextState2[0].downVotesBy).not.toContain('user-1'); // Downvote berhasil dicabut
  });
});
