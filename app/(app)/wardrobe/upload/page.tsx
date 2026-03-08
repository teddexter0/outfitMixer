'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UploadForm } from '@/components/wardrobe/UploadForm';

export default function UploadPage() {
  const router = useRouter();

  return (
    <main className="px-4 pt-8 pb-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-white/40 hover:text-white transition-colors text-sm"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-white">Add Item</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <UploadForm onSuccess={() => router.push('/wardrobe')} />
      </motion.div>
    </main>
  );
}
