/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'redux';
import { api } from '@/src/lib/api';
import { LeaderboardItem } from '@/src/types';
import { ActionType } from './actionTypes';
import { setLoadingActionCreator } from './authActions';

export const setLeaderboardsActionCreator = (
  leaderboards: LeaderboardItem[]
) => ({
  type: ActionType.SET_LEADERBOARDS,
  payload: { leaderboards },
});

export const asyncReceiveLeaderboards = () => {
  return async (dispatch: Dispatch) => {
    dispatch(setLoadingActionCreator(true));
    try {
      const leaderboards = await api.getLeaderboards();
      dispatch(setLeaderboardsActionCreator(leaderboards));
    } catch (error: any) {
      alert(error.message);
    }
    dispatch(setLoadingActionCreator(false));
  };
};
