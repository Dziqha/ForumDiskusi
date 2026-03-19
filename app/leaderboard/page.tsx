/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/src/redux/store';
import Navigation from '@/src/components/common/Navigation';
import LoadingIndicator from '@/src/components/common/LoadingIndicator';
import LeaderboardTable from '@/src/components/leaderboard/LeaderboardTable';
import {
  asyncUnsetAuthUser,
  asyncPreloadProcess,
} from '@/src/redux/actions/authActions';
import { asyncReceiveLeaderboards } from '@/src/redux/actions/leaderboardActions';


export default function LeaderboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { authUser, leaderboards, isLoading } = useSelector(
    (state: RootState) => state
  );

  useEffect(() => {
    dispatch(asyncPreloadProcess() as any);
    dispatch(asyncReceiveLeaderboards() as any);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(asyncUnsetAuthUser() as any);
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {isLoading && <LoadingIndicator />}
      <Navigation authUser={authUser} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
        <LeaderboardTable leaderboards={leaderboards} />
      </main>
    </div>
  );
}
