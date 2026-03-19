/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/src/redux/store';
import LoadingIndicator from '@/src/components/common/LoadingIndicator';
import RegisterForm from '@/src/components/auth/RegisterForm';
import { asyncRegisterUser } from '@/src/redux/actions/authActions';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state);

  const handleRegister = (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    dispatch(asyncRegisterUser(userData) as any).then(() => {
      router.push('/login');
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {isLoading && <LoadingIndicator />}
      <main className="container mx-auto px-4 py-8">
        <RegisterForm onRegister={handleRegister} />
      </main>
    </div>
  );
}
