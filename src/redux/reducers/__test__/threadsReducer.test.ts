/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import threadsReducer from '../threadsReducer';
import { ActionType } from '../../actions/actionTypes';
import { Thread } from '@/src/types';

describe('threadsReducer', () => {
  it('should return initial state when given unknown action', () => {
    const initialState: Thread[] = [];
    const action = { type: 'UNKNOWN' };

    const nextState = threadsReducer(initialState, action);

    expect(nextState).toEqual(initialState);
  });

  it('should return threads when given SET_THREADS action', () => {
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

    const nextState = threadsReducer(initialState, action);

    expect(nextState).toEqual(action.payload.threads);
    expect(nextState).toHaveLength(999);
  });

  it('should add new thread at the beginning when given ADD_THREAD action', () => {
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

    const nextState = threadsReducer(initialState, action);

    expect(nextState).toHaveLength(2);
    expect(nextState[0]).toEqual(newThread);
    expect(nextState[1]).toEqual(initialState[0]);
  });

  it('should add userId to upVotesBy when not upvoted yet', () => {
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

    const nextState = threadsReducer(initialState, action);

    expect(nextState[0].upVotesBy).toContain('user-2');
    expect(nextState[0].upVotesBy).toHaveLength(1);
  });

  it('should remove userId from upVotesBy when already upvoted', () => {
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

    const nextState = threadsReducer(initialState, action);

    expect(nextState[0].upVotesBy).not.toContain('user-2');
    expect(nextState[0].upVotesBy).toHaveLength(0);
  });

  it('should remove userId from downVotesBy when toggling upvote', () => {
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

    const nextState = threadsReducer(initialState, action);

    expect(nextState[0].upVotesBy).toContain('user-2');
    expect(nextState[0].downVotesBy).not.toContain('user-2');
    expect(nextState[0].downVotesBy).toHaveLength(0);
  });

  it('should add userId to downVotesBy when not downvoted yet', () => {
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

    const nextState = threadsReducer(initialState, action);

    expect(nextState[0].downVotesBy).toContain('user-2');
    expect(nextState[0].downVotesBy).toHaveLength(1);
  });

  it('should remove userId from downVotesBy when already downvoted', () => {
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

    const nextState = threadsReducer(initialState, action);

    expect(nextState[0].downVotesBy).not.toContain('user-2');
    expect(nextState[0].downVotesBy).toHaveLength(0);
  });

  it('should remove userId from upVotesBy when toggling downvote', () => {
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

    const nextState = threadsReducer(initialState, action);

    expect(nextState[0].downVotesBy).toContain('user-2');
    expect(nextState[0].upVotesBy).not.toContain('user-2');
    expect(nextState[0].upVotesBy).toHaveLength(0);
  });
});

describe('TOGGLE_UPVOTE_THREAD action', () => {
  it('should toggle upvote a thread properly', () => {
    const initialState: any = [
      { id: 'thread-1', upVotesBy: [], downVotesBy: ['user-1'] },
      { id: 'thread-2', upVotesBy: [], downVotesBy: [] },
    ];

    const action1 = {
      type: 'TOGGLE_UPVOTE_THREAD',
      payload: { threadId: 'thread-1', userId: 'user-1', isUpVoted: false },
    };
    const nextState1 = threadsReducer(initialState, action1);

    expect(nextState1[0].upVotesBy).toContain('user-1');
    expect(nextState1[0].downVotesBy).not.toContain('user-1');
    expect(nextState1[1]).toEqual(initialState[1]);

    const action2 = {
      type: 'TOGGLE_UPVOTE_THREAD',
      payload: { threadId: 'thread-1', userId: 'user-1', isUpVoted: true },
    };
    const nextState2 = threadsReducer(nextState1, action2);
    expect(nextState2[0].upVotesBy).not.toContain('user-1');
  });
});

describe('TOGGLE_DOWNVOTE_THREAD action', () => {
  it('should toggle downvote a thread properly', () => {
    const initialState: any = [
      { id: 'thread-1', upVotesBy: ['user-1'], downVotesBy: [] },
      { id: 'thread-2', upVotesBy: [], downVotesBy: [] },
    ];

    const action1 = {
      type: 'TOGGLE_DOWNVOTE_THREAD',
      payload: { threadId: 'thread-1', userId: 'user-1', isDownVoted: false },
    };
    const nextState1 = threadsReducer(initialState, action1);

    expect(nextState1[0].downVotesBy).toContain('user-1');
    expect(nextState1[0].upVotesBy).not.toContain('user-1');
    expect(nextState1[1]).toEqual(initialState[1]);

    const action2 = {
      type: 'TOGGLE_DOWNVOTE_THREAD',
      payload: { threadId: 'thread-1', userId: 'user-1', isDownVoted: true },
    };
    const nextState2 = threadsReducer(nextState1, action2);
    expect(nextState2[0].downVotesBy).not.toContain('user-1');
  });
});
