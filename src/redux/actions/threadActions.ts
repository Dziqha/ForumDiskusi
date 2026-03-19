/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'redux';
import { api } from '@/src/lib/api';
import { Thread, ThreadDetail, User } from '@/src/types';
import { ActionType } from './actionTypes';
import { setLoadingActionCreator } from './authActions';

export const setThreadsActionCreator = (threads: Thread[]) => ({
  type: ActionType.SET_THREADS,
  payload: { threads },
});

export const addThreadActionCreator = (thread: Thread) => ({
  type: ActionType.ADD_THREAD,
  payload: { thread },
});

export const setThreadDetailActionCreator = (
  threadDetail: ThreadDetail | null
) => ({
  type: ActionType.SET_THREAD_DETAIL,
  payload: { threadDetail },
});

export const setUsersActionCreator = (users: User[]) => ({
  type: ActionType.SET_USERS,
  payload: { users },
});

export const asyncPopulateUsersAndThreads = () => {
  return async (dispatch: Dispatch) => {
    dispatch(setLoadingActionCreator(true));
    try {
      const [users, threads] = await Promise.all([
        api.getAllUsers(),
        api.getThreads(),
      ]);
      dispatch(setUsersActionCreator(users));
      dispatch(setThreadsActionCreator(threads));
    } catch (error: any) {
      alert(error.message);
    }
    dispatch(setLoadingActionCreator(false));
  };
};

export const asyncAddThread = ({
  title,
  body,
  category,
}: {
  title: string;
  body: string;
  category: string;
}) => {
  return async (dispatch: Dispatch) => {
    dispatch(setLoadingActionCreator(true));
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');
      const thread = await api.createThread(title, body, category, token);
      dispatch(addThreadActionCreator(thread));
    } catch (error: any) {
      alert(error.message);
    }
    dispatch(setLoadingActionCreator(false));
  };
};

export const asyncReceiveThreadDetail = (threadId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(setLoadingActionCreator(true));
    dispatch(setThreadDetailActionCreator(null));
    try {
      const threadDetail = await api.getThreadDetail(threadId);
      dispatch(setThreadDetailActionCreator(threadDetail));
    } catch (error: any) {
      alert(error.message);
    }
    dispatch(setLoadingActionCreator(false));
  };
};
