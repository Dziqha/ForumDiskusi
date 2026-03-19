/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import threadDetailReducer from '../threadDetailReducer';
import { ActionType } from '../../actions/actionTypes';
import { ThreadDetail, ThreadComment } from '@/src/types';

describe('threadDetailReducer', () => {
  const mockThreadDetail: ThreadDetail = {
    id: 'thread-1',
    title: 'Thread Test',
    body: 'Body thread test',
    category: 'react',
    createdAt: '2024-01-01',
    ownerId: 'user-1',
    owner: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg',
    },
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 0,
    comments: [],
  };

  it('should return initial state when given unknown action', () => {
    const nextState = threadDetailReducer(null, { type: 'UNKNOWN' } as any);
    expect(nextState).toBeNull();
  });

  it('should set thread detail when given SET_THREAD_DETAIL action', () => {
    const action = {
      type: ActionType.SET_THREAD_DETAIL,
      payload: { threadDetail: mockThreadDetail },
    };
    const nextState = threadDetailReducer(null, action);
    expect(nextState).toEqual(mockThreadDetail);
  });

  it('should add new comment when given ADD_COMMENT action', () => {
    const newComment: ThreadComment = {
      id: 'comment-1',
      content: 'Hello',
      createdAt: '2024-01-02',
      owner: { id: 'user-2', name: 'Jane', email: 'jane@test.com', avatar: '' },
      upVotesBy: [],
      downVotesBy: [],
    };
    const action = {
      type: ActionType.ADD_COMMENT,
      payload: { comment: newComment },
    };

    expect(threadDetailReducer(null, action)).toBeNull();

    const nextState = threadDetailReducer(mockThreadDetail, action);
    expect(nextState?.comments[0]).toEqual(newComment);
  });

  describe('TOGGLE_UPVOTE_THREAD action', () => {
    it('should toggle upvote on thread detail correctly', () => {
      const initialState = { ...mockThreadDetail, downVotesBy: ['user-1'] };
      const actionAdd = {
        type: ActionType.TOGGLE_UPVOTE_THREAD,
        payload: { threadId: 'thread-1', userId: 'user-1', isUpVoted: false },
      };
      const stateAfterAdd = threadDetailReducer(initialState, actionAdd);
      expect(stateAfterAdd?.upVotesBy).toContain('user-1');
      expect(stateAfterAdd?.downVotesBy).not.toContain('user-1');

      const actionRemove = {
        type: ActionType.TOGGLE_UPVOTE_THREAD,
        payload: { threadId: 'thread-1', userId: 'user-1', isUpVoted: true },
      };
      const stateAfterRemove = threadDetailReducer(stateAfterAdd, actionRemove);
      expect(stateAfterRemove?.upVotesBy).not.toContain('user-1');

      const actionWrongId = {
        type: ActionType.TOGGLE_UPVOTE_THREAD,
        payload: { threadId: 'wrong-id', userId: 'user-1', isUpVoted: false },
      };
      expect(threadDetailReducer(mockThreadDetail, actionWrongId)).toEqual(
        mockThreadDetail,
      );
    });
    it('should return the same state if threadId does not match', () => {
      const action = {
        type: ActionType.TOGGLE_UPVOTE_THREAD,
        payload: { threadId: 'wrong-id', userId: 'user-1', isUpVoted: false },
      };
      const nextState = threadDetailReducer(mockThreadDetail, action);
      expect(nextState).toBe(mockThreadDetail);
    });
    it('should return the current threadDetail if threadId does not match during upvote', () => {
      const initialState = { ...mockThreadDetail, id: 'thread-1' };
      const action = {
        type: ActionType.TOGGLE_UPVOTE_THREAD,
        payload: {
          threadId: 'thread-berbeda',
          userId: 'user-1',
          isUpVoted: false,
        },
      };

      const nextState = threadDetailReducer(initialState, action);


      expect(nextState).toEqual(initialState);
    });
  });

  describe('TOGGLE_DOWNVOTE_THREAD action', () => {
    it('should toggle downvote on thread detail correctly', () => {
      const initialState = { ...mockThreadDetail, upVotesBy: ['user-1'] };
      const actionAdd = {
        type: ActionType.TOGGLE_DOWNVOTE_THREAD,
        payload: { threadId: 'thread-1', userId: 'user-1', isDownVoted: false },
      };
      const stateAfterAdd = threadDetailReducer(initialState, actionAdd);
      expect(stateAfterAdd?.downVotesBy).toContain('user-1');
      expect(stateAfterAdd?.upVotesBy).not.toContain('user-1');

      const actionRemove = {
        type: ActionType.TOGGLE_DOWNVOTE_THREAD,
        payload: { threadId: 'thread-1', userId: 'user-1', isDownVoted: true },
      };
      const stateAfterRemove = threadDetailReducer(stateAfterAdd, actionRemove);
      expect(stateAfterRemove?.downVotesBy).not.toContain('user-1');
    });
    it('should return the current threadDetail if threadId does not match during downvote', () => {
      const action = {
        type: ActionType.TOGGLE_DOWNVOTE_THREAD,
        payload: {
          threadId: 'id-salah-lagi',
          userId: 'user-1',
          isDownVoted: false,
        },
      };

      const nextState = threadDetailReducer(mockThreadDetail, action);

      expect(nextState).toBe(mockThreadDetail);
    });
  });

  describe('TOGGLE_UPVOTE_COMMENT action', () => {
    it('should toggle upvote on comment correctly', () => {
      const comment: ThreadComment = {
        id: 'comment-1',
        content: 'Test',
        createdAt: '',
        owner: { id: 'u1', name: 'N', email: 'e', avatar: '' },
        upVotesBy: [],
        downVotesBy: ['user-1'],
      };
      const initialState = {
        ...mockThreadDetail,
        comments: [comment, { ...comment, id: 'comment-2' }],
      };

      expect(
        threadDetailReducer(null, {
          type: ActionType.TOGGLE_UPVOTE_COMMENT,
        } as any),
      ).toBeNull();

      const actionAdd = {
        type: ActionType.TOGGLE_UPVOTE_COMMENT,
        payload: { commentId: 'comment-1', userId: 'user-1', isUpVoted: false },
      };
      const stateAfterAdd = threadDetailReducer(initialState, actionAdd);
      expect(stateAfterAdd?.comments[0].upVotesBy).toContain('user-1');
      expect(stateAfterAdd?.comments[0].downVotesBy).not.toContain('user-1');
      expect(stateAfterAdd?.comments[1].id).toBe('comment-2');

      const actionRemove = {
        type: ActionType.TOGGLE_UPVOTE_COMMENT,
        payload: { commentId: 'comment-1', userId: 'user-1', isUpVoted: true },
      };
      const stateAfterRemove = threadDetailReducer(stateAfterAdd, actionRemove);
      expect(stateAfterRemove?.comments[0].upVotesBy).not.toContain('user-1');
    });
  });

  describe('TOGGLE_DOWNVOTE_COMMENT action', () => {
    it('should toggle downvote on comment correctly', () => {
      const comment: ThreadComment = {
        id: 'comment-1',
        content: 'Test',
        createdAt: '',
        owner: { id: 'u1', name: 'N', email: 'e', avatar: '' },
        upVotesBy: ['user-1'],
        downVotesBy: [],
      };
      const initialState = { ...mockThreadDetail, comments: [comment] };

      expect(
        threadDetailReducer(null, {
          type: ActionType.TOGGLE_DOWNVOTE_COMMENT,
        } as any),
      ).toBeNull();

      const actionAdd = {
        type: ActionType.TOGGLE_DOWNVOTE_COMMENT,
        payload: {
          commentId: 'comment-1',
          userId: 'user-1',
          isDownVoted: false,
        },
      };
      const stateAfterAdd = threadDetailReducer(initialState, actionAdd);
      expect(stateAfterAdd?.comments[0].downVotesBy).toContain('user-1');
      expect(stateAfterAdd?.comments[0].upVotesBy).not.toContain('user-1');

      const actionRemove = {
        type: ActionType.TOGGLE_DOWNVOTE_COMMENT,
        payload: {
          commentId: 'comment-1',
          userId: 'user-1',
          isDownVoted: true,
        },
      };
      const stateAfterRemove = threadDetailReducer(stateAfterAdd, actionRemove);
      expect(stateAfterRemove?.comments[0].downVotesBy).not.toContain('user-1');
    });
    it('should return the same comment if commentId does not match during toggle', () => {
      const comment: ThreadComment = {
        id: 'comment-1',
        content: 'Test',
        createdAt: '',
        owner: { id: 'u1', name: 'N', email: 'e', avatar: '' },
        upVotesBy: [],
        downVotesBy: [],
      };
      const initialState = { ...mockThreadDetail, comments: [comment] };
      const action = {
        type: ActionType.TOGGLE_DOWNVOTE_COMMENT,
        payload: {
          commentId: 'wrong-comment-id',
          userId: 'user-1',
          isDownVoted: false,
        },
      };
      const nextState = threadDetailReducer(initialState, action);
      expect(nextState?.comments[0]).toBe(comment);
    });
  });
});
