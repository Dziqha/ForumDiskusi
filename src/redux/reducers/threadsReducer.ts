/* eslint-disable @typescript-eslint/no-explicit-any */
import { Thread } from '@/src/types';
import { ActionType } from '../actions/actionTypes';

export default function threadsReducer(
  threads: Thread[] = [],
  action: any = {}
): Thread[] {
  switch (action.type) {
  case ActionType.SET_THREADS:
    return action.payload.threads;
  case ActionType.ADD_THREAD:
    return [action.payload.thread, ...threads];
  case ActionType.TOGGLE_UPVOTE_THREAD:
    return threads.map((thread) => {
      if (thread.id === action.payload.threadId) {
        return {
          ...thread,
          upVotesBy: action.payload.isUpVoted
            ? thread.upVotesBy.filter((id) => id !== action.payload.userId)
            : [...thread.upVotesBy, action.payload.userId],
          downVotesBy: thread.downVotesBy.filter(
            (id) => id !== action.payload.userId
          ),
        };
      }
      return thread;
    });
  case ActionType.TOGGLE_DOWNVOTE_THREAD:
    return threads.map((thread) => {
      if (thread.id === action.payload.threadId) {
        return {
          ...thread,
          downVotesBy: action.payload.isDownVoted
            ? thread.downVotesBy.filter((id) => id !== action.payload.userId)
            : [...thread.downVotesBy, action.payload.userId],
          upVotesBy: thread.upVotesBy.filter(
            (id) => id !== action.payload.userId
          ),
        };
      }
      return thread;
    });
  default:
    return threads;
  }
}
