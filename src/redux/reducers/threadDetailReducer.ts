/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThreadDetail } from '@/src/types';
import { ActionType } from '../actions/actionTypes';

export default function threadDetailReducer(
  threadDetail: ThreadDetail | null = null,
  action: any = {}
): ThreadDetail | null {
  switch (action.type) {
  case ActionType.SET_THREAD_DETAIL:
    return action.payload.threadDetail;
  case ActionType.ADD_COMMENT:
    if (!threadDetail) return null;
    return {
      ...threadDetail,
      comments: [action.payload.comment, ...threadDetail.comments],
    };
  case ActionType.TOGGLE_UPVOTE_THREAD:
    if (threadDetail && threadDetail.id === action.payload.threadId) {
      return {
        ...threadDetail,
        upVotesBy: action.payload.isUpVoted
          ? threadDetail.upVotesBy.filter(
            (id) => id !== action.payload.userId
          )
          : [...threadDetail.upVotesBy, action.payload.userId],
        downVotesBy: threadDetail.downVotesBy.filter(
          (id) => id !== action.payload.userId
        ),
      };
    }
    return threadDetail;
  case ActionType.TOGGLE_DOWNVOTE_THREAD:
    if (threadDetail && threadDetail.id === action.payload.threadId) {
      return {
        ...threadDetail,
        downVotesBy: action.payload.isDownVoted
          ? threadDetail.downVotesBy.filter(
            (id) => id !== action.payload.userId
          )
          : [...threadDetail.downVotesBy, action.payload.userId],
        upVotesBy: threadDetail.upVotesBy.filter(
          (id) => id !== action.payload.userId
        ),
      };
    }
    return threadDetail;
  case ActionType.TOGGLE_UPVOTE_COMMENT:
    if (!threadDetail) return null;
    return {
      ...threadDetail,
      comments: threadDetail.comments.map((comment) => {
        if (comment.id === action.payload.commentId) {
          return {
            ...comment,
            upVotesBy: action.payload.isUpVoted
              ? comment.upVotesBy.filter((id) => id !== action.payload.userId)
              : [...comment.upVotesBy, action.payload.userId],
            downVotesBy: comment.downVotesBy.filter(
              (id) => id !== action.payload.userId
            ),
          };
        }
        return comment;
      }),
    };
  case ActionType.TOGGLE_DOWNVOTE_COMMENT:
    if (!threadDetail) return null;
    return {
      ...threadDetail,
      comments: threadDetail.comments.map((comment) => {
        if (comment.id === action.payload.commentId) {
          return {
            ...comment,
            downVotesBy: action.payload.isDownVoted
              ? comment.downVotesBy.filter(
                (id) => id !== action.payload.userId
              )
              : [...comment.downVotesBy, action.payload.userId],
            upVotesBy: comment.upVotesBy.filter(
              (id) => id !== action.payload.userId
            ),
          };
        }
        return comment;
      }),
    };
  default:
    return threadDetail;
  }
}
