/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'redux';
import { api } from '@/src/lib/api';
import { ThreadComment } from '@/src/types';
import { ActionType } from './actionTypes';
import { setLoadingActionCreator } from './authActions';

export const addCommentActionCreator = (comment: ThreadComment) => ({
  type: ActionType.ADD_COMMENT,
  payload: { comment },
});

export const asyncAddComment = ({
  threadId,
  content,
}: {
  threadId: string;
  content: string;
}) => {
  return async (dispatch: Dispatch) => {
    dispatch(setLoadingActionCreator(true));
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');
      const comment = await api.createComment(threadId, content, token);
      dispatch(addCommentActionCreator(comment));
    } catch (error: any) {
      alert(error.message);
    }
    dispatch(setLoadingActionCreator(false));
  };
};
