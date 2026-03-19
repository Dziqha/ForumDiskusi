/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'redux';
import { api } from '@/src/lib/api';
import { RootState } from '@/src/types';
import { ActionType } from './actionTypes';

export const toggleUpVoteThreadActionCreator = (
  threadId: string,
  userId: string,
  isUpVoted: boolean
) => ({
  type: ActionType.TOGGLE_UPVOTE_THREAD,
  payload: { threadId, userId, isUpVoted },
});

export const toggleDownVoteThreadActionCreator = (
  threadId: string,
  userId: string,
  isDownVoted: boolean
) => ({
  type: ActionType.TOGGLE_DOWNVOTE_THREAD,
  payload: { threadId, userId, isDownVoted },
});

export const toggleUpVoteCommentActionCreator = (
  commentId: string,
  userId: string,
  isUpVoted: boolean
) => ({
  type: ActionType.TOGGLE_UPVOTE_COMMENT,
  payload: { commentId, userId, isUpVoted },
});

export const toggleDownVoteCommentActionCreator = (
  commentId: string,
  userId: string,
  isDownVoted: boolean
) => ({
  type: ActionType.TOGGLE_DOWNVOTE_COMMENT,
  payload: { commentId, userId, isDownVoted },
});

export const asyncToggleUpVoteThread = (threadId: string) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const { authUser, threads, threadDetail } = getState();
    if (!authUser) return;

    let isUpVoted = false;
    if (threadDetail && threadDetail.id === threadId) {
      isUpVoted = threadDetail.upVotesBy.includes(authUser.id);
    } else {
      const thread = threads.find((t) => t.id === threadId);
      isUpVoted = thread ? thread.upVotesBy.includes(authUser.id) : false;
    }

    dispatch(toggleUpVoteThreadActionCreator(threadId, authUser.id, isUpVoted));

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');
      if (isUpVoted) {
        await api.neutralVoteThread(threadId, token);
      } else {
        await api.upVoteThread(threadId, token);
      }
    } catch (error: any) {
      alert(error.message);
      dispatch(
        toggleUpVoteThreadActionCreator(threadId, authUser.id, !isUpVoted)
      );
    }
  };
};

export const asyncToggleDownVoteThread = (threadId: string) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const { authUser, threads, threadDetail } = getState();
    if (!authUser) return;

    let isDownVoted = false;
    if (threadDetail && threadDetail.id === threadId) {
      isDownVoted = threadDetail.downVotesBy.includes(authUser.id);
    } else {
      const thread = threads.find((t) => t.id === threadId);
      isDownVoted = thread ? thread.downVotesBy.includes(authUser.id) : false;
    }

    dispatch(
      toggleDownVoteThreadActionCreator(threadId, authUser.id, isDownVoted)
    );

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');
      if (isDownVoted) {
        await api.neutralVoteThread(threadId, token);
      } else {
        await api.downVoteThread(threadId, token);
      }
    } catch (error: any) {
      alert(error.message);
      dispatch(
        toggleDownVoteThreadActionCreator(threadId, authUser.id, !isDownVoted)
      );
    }
  };
};

export const asyncToggleUpVoteComment = (commentId: string) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const { authUser, threadDetail } = getState();
    if (!authUser || !threadDetail) return;

    const comment = threadDetail.comments.find((c) => c.id === commentId);
    if (!comment) return;

    const isUpVoted = comment.upVotesBy.includes(authUser.id);

    dispatch(
      toggleUpVoteCommentActionCreator(commentId, authUser.id, isUpVoted)
    );

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');
      if (isUpVoted) {
        await api.neutralVoteComment(threadDetail.id, commentId, token);
      } else {
        await api.upVoteComment(threadDetail.id, commentId, token);
      }
    } catch (error: any) {
      alert(error.message);
      dispatch(
        toggleUpVoteCommentActionCreator(commentId, authUser.id, !isUpVoted)
      );
    }
  };
};

export const asyncToggleDownVoteComment = (commentId: string) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const { authUser, threadDetail } = getState();
    if (!authUser || !threadDetail) return;

    const comment = threadDetail.comments.find((c) => c.id === commentId);
    if (!comment) return;

    const isDownVoted = comment.downVotesBy.includes(authUser.id);

    dispatch(
      toggleDownVoteCommentActionCreator(commentId, authUser.id, isDownVoted)
    );

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');
      if (isDownVoted) {
        await api.neutralVoteComment(threadDetail.id, commentId, token);
      } else {
        await api.downVoteComment(threadDetail.id, commentId, token);
      }
    } catch (error: any) {
      alert(error.message);
      dispatch(
        toggleDownVoteCommentActionCreator(commentId, authUser.id, !isDownVoted)
      );
    }
  };
};
