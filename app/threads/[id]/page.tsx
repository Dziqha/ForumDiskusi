/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/src/redux/store';
import Navigation from '@/src/components/common/Navigation';
import LoadingIndicator from '@/src/components/common/LoadingIndicator';
import ThreadDetailHeader from '@/src/components/detail/ThreadDetailHeader';
import CommentForm from '@/src/components/comment/CommentForm';
import CommentList from '@/src/components/comment/CommentList';
import { asyncUnsetAuthUser } from '@/src/redux/actions/authActions';
import { asyncReceiveThreadDetail } from '@/src/redux/actions/threadActions';
import { asyncAddComment } from '@/src/redux/actions/commentActions';
import {
  asyncToggleUpVoteThread,
  asyncToggleDownVoteThread,
  asyncToggleUpVoteComment,
  asyncToggleDownVoteComment,
} from '@/src/redux/actions/voteActions';

export default function ThreadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { authUser, threadDetail, users, isLoading } = useSelector(
    (state: RootState) => state
  );
  const threadId = params.id as string;

  useEffect(() => {
    if (threadId) {
      dispatch(asyncReceiveThreadDetail(threadId) as any);
    }
  }, [dispatch, threadId]);

  const handleLogout = () => {
    dispatch(asyncUnsetAuthUser() as any);
    router.replace('/login');
  };

  const handleAddComment = (content: string) => {
    if (!authUser) {
      alert('Silakan login untuk menambahkan komentar');
      return;
    }
    dispatch(asyncAddComment({ threadId, content }) as any);
  };

  const handleBackToList = () => {
    router.push('/');
  };

  if (!threadDetail) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation authUser={authUser} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-10">Memuat detail thread...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {isLoading && <LoadingIndicator />}
      <Navigation authUser={authUser} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={handleBackToList}
          className="mb-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Kembali
        </button>
        <ThreadDetailHeader
          threadDetail={threadDetail}
          owner={threadDetail.owner}
          onUpVote={() =>
            dispatch(asyncToggleUpVoteThread(threadDetail.id) as any)
          }
          onDownVote={() =>
            dispatch(asyncToggleDownVoteThread(threadDetail.id) as any)
          }
          authUser={authUser}
        />
        <CommentForm onSubmit={handleAddComment} />
        <CommentList
          comments={threadDetail.comments}
          users={users}
          onUpVote={(commentId) =>
            dispatch(asyncToggleUpVoteComment(commentId) as any)
          }
          onDownVote={(commentId) =>
            dispatch(asyncToggleDownVoteComment(commentId) as any)
          }
          authUser={authUser}
        />
      </main>
    </div>
  );
}
