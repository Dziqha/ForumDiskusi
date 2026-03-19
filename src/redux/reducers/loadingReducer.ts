/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionType } from '../actions/actionTypes';

export default function loadingReducer(
  isLoading: boolean = false,
  action: any = {}
): boolean {
  switch (action.type) {
  case ActionType.SET_LOADING:
    return action.payload.isLoading;
  default:
    return isLoading;
  }
}
