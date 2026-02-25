'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [session, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-200">
          <ShieldCheck size={48} className="animate-pulse" />
        </div>
        <p className="text-slate-500 font-medium animate-pulse">جاري التحميل...</p>
      </motion.div>
    </div>
  );
}
