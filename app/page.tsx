/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Pastikan import dari next/navigation
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/src/redux/store';
import Navigation from '@/src/components/common/Navigation';
import LoadingIndicator from '@/src/components/common/LoadingIndicator';
import CreateThreadForm from '@/src/components/thread/CreateThreadForm';
import CategoryFilter from '@/src/components/thread/CategoryFilter';
import ThreadList from '@/src/components/thread/ThreadList';
import {
  asyncPreloadProcess,
  asyncUnsetAuthUser,
} from '@/src/redux/actions/authActions';
import {
  asyncPopulateUsersAndThreads,
  asyncAddThread,
} from '@/src/redux/actions/threadActions';
import {
  asyncToggleUpVoteThread,
  asyncToggleDownVoteThread,
} from '@/src/redux/actions/voteActions';

export default function HomePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { authUser, threads, users, isLoading } = useSelector(
    (state: RootState) => state
  );
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isPreloading, setIsPreloading] = useState(true);

  useEffect(() => {
    dispatch(asyncPreloadProcess() as any).then((result: any) => {
      setIsPreloading(false);

      if (!result) {
        router.push('/login');
      }
    });

    dispatch(asyncPopulateUsersAndThreads() as any);
  }, [dispatch, router]);

  useEffect(() => {
    if (!isPreloading && !authUser) {
      router.push('/login');
    }
  }, [authUser, isPreloading, router]);

  const categories = [
    ...new Set(threads.map((thread: { category: any }) => thread.category)),
  ];

  const handleLogout = () => {
    dispatch(asyncUnsetAuthUser() as any);
  };

  const handleAddThread = (threadData: {
    title: string;
    body: string;
    category: string;
  }) => {
    if (!authUser) return;
    dispatch(asyncAddThread(threadData) as any);
  };

  const handleThreadClick = (threadId: string) => {
    router.push(`/threads/${threadId}`);
  };

  if (isPreloading) {
    return <LoadingIndicator />;
  }

  if (!authUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {isLoading && <LoadingIndicator />}
      <Navigation authUser={authUser} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Forum Diskusi</h1>
        {authUser && <CreateThreadForm onSubmit={handleAddThread} />}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <ThreadList
          threads={threads}
          users={users}
          onThreadClick={handleThreadClick}
          onUpVote={(threadId) =>
            dispatch(asyncToggleUpVoteThread(threadId) as any)
          }
          onDownVote={(threadId) =>
            dispatch(asyncToggleDownVoteThread(threadId) as any)
          }
          authUser={authUser}
          selectedCategory={selectedCategory}
        />
      </main>
    </div>
  );
}
