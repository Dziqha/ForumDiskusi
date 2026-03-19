'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';

interface LoginFormProps {
  onLogin: (credentials: { email: string; password: string }) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  const imageUrl =
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop';

  return (
    <div className="fixed inset-0 flex w-full h-full overflow-hidden bg-white z-50">
      <div className="hidden md:block md:w-1/2 relative h-full">
        <Image
          src={imageUrl}
          alt="Login Illustration"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-blue-900/10" />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Selamat Datang
            </h2>
            <p className="text-gray-500 mt-2">Silakan masuk ke akun Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 ml-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 ml-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] mt-4"
            >
              Masuk Sekarang
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Belum punya akun?{' '}
            <a
              href="/register"
              className="text-blue-600 font-bold hover:underline"
            >
              Daftar Gratis
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
