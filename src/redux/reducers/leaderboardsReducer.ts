/* eslint-disable @typescript-eslint/no-explicit-any */
import { LeaderboardItem } from '@/src/types';
import { ActionType } from '../actions/actionTypes';

export default function leaderboardsReducer(
  leaderboards: LeaderboardItem[] = [],
  action: any = {}
): LeaderboardItem[] {
  switch (action.type) {
  case ActionType.SET_LEADERBOARDS:
    return action.payload.leaderboards;
  default:
    return leaderboards;
  }
}
