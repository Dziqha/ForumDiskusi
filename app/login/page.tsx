/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/src/redux/store';
import LoadingIndicator from '@/src/components/common/LoadingIndicator';
import LoginForm from '@/src/components/auth/LoginForm';
import { asyncSetAuthUser } from '@/src/redux/actions/authActions';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state);

  const handleLogin = (credentials: { email: string; password: string }) => {
    dispatch(asyncSetAuthUser(credentials) as any).then(() => {
      router.push('/');
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {isLoading && <LoadingIndicator />}
      <main className="container mx-auto px-4 py-8">
        <LoginForm onLogin={handleLogin} />
      </main>
    </div>
  );
}
