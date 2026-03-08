'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/LoadingSpinner';

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [user, loading, router]);

  if (loading) return <PageLoader />;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8 max-w-xs w-full"
      >
        {/* Logo/wordmark */}
        <div className="space-y-2">
          <div className="text-5xl">👕</div>
          <h1 className="text-3xl font-bold tracking-tight text-white">OutfitMixer</h1>
          <p className="text-white/40 text-sm leading-relaxed">
            Upload your clothes once. Never stare at your wardrobe at 7am again.
          </p>
        </div>

        {/* Sign in */}
        <div className="space-y-3">
          <Button onClick={signInWithGoogle} size="lg" className="w-full">
            Sign in with Google
          </Button>
          <p className="text-white/20 text-xs">Private — only you can see your wardrobe</p>
        </div>
      </motion.div>
    </main>
  );
}
