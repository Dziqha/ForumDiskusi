/* eslint-disable react-hooks/set-state-in-effect */
import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  Trophy,
  LogIn,
  LogOut,
  MoreHorizontal,
  User as UserIcon,
} from 'lucide-react';
import { User } from '@/src/types';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomNavigationProps {
  authUser: User | null;
  onLogout: () => void;
}

export default function Navigation({
  authUser,
  onLogout,
}: BottomNavigationProps) {
  const [collapsed, setCollapsed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCollapsed(false);
    timeoutRef.current = setTimeout(() => setCollapsed(true), 8000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div>
      <AnimatePresence>
        {!collapsed && (
          <motion.nav
            key="full"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
            onMouseMove={resetTimer}
            onMouseEnter={resetTimer}
          >
            <div className="flex items-center gap-1 px-4 py-2 bg-white/90 backdrop-blur border rounded-full shadow-lg">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">Beranda</span>
              </Link>

              <Link
                href="/leaderboard"
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition"
              >
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-medium">Leaderboard</span>
              </Link>

              {authUser ? (
                <div className="flex items-center gap-2 pl-2 border-l">
                  <Image
                    src={authUser.avatar}
                    alt={authUser.name}
                    width={24}
                    height={24}
                    unoptimized
                    className="rounded-full"
                  />
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium">Login</span>
                  </Link>

                  <Link
                    href="/register"
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Register</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {collapsed && (
          <motion.div
            key="collapsed"
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 550, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/90 backdrop-blur border rounded-full shadow-lg flex items-center justify-center cursor-pointer z-50"
            onMouseEnter={resetTimer}
          >
            <MoreHorizontal className="w-6 h-6 text-gray-600" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
