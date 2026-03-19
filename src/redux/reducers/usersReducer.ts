/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@/src/types';
import { ActionType } from '../actions/actionTypes';

export default function usersReducer(
  users: User[] = [],
  action: any = {}
): User[] {
  switch (action.type) {
  case ActionType.SET_USERS:
    return action.payload.users;
  default:
    return users;
  }
}
