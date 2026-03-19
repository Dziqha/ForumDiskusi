/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@/src/types';
import { ActionType } from '../actions/actionTypes';

type AuthUserAction =
  | { type: typeof ActionType.SET_AUTH_USER; payload: { authUser: User } }
  | { type: typeof ActionType.UNSET_AUTH_USER };

export default function authUserReducer(
  authUser: User | null = null,
  action: AuthUserAction | any = {}
): User | null {
  switch (action.type) {
  case ActionType.SET_AUTH_USER:
    return action.payload.authUser;
  case ActionType.UNSET_AUTH_USER:
    return null;
  default:
    return authUser;
  }
}
