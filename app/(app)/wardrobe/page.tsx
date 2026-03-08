'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { deleteItem } from '@/lib/firestore';
import { deleteItemImage } from '@/lib/storage';
import { useWardrobe } from '@/hooks/useWardrobe';
import { WardrobeItem } from '@/types';
import { ItemGrid } from '@/components/wardrobe/ItemGrid';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/LoadingSpinner';

export default function WardrobePage() {
  const { user } = useAuth();
  const { items, loading, refresh } = useWardrobe();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (item: WardrobeItem) => {
    if (!user || !confirm(`Delete "${item.name ?? item.category}"?`)) return;
    setDeleting(item.id);
    try {
      await Promise.all([
        deleteItem(user.uid, item.id),
        deleteItemImage(item.imageUrl),
      ]);
      await refresh();
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <main className="px-4 pt-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Wardrobe</h1>
          <p className="text-sm text-white/40 mt-0.5">{items.length} items</p>
        </div>
        <Link href="/wardrobe/upload">
          <Button size="sm">+ Add</Button>
        </Link>
      </div>

      {/* Grid */}
      <ItemGrid items={items} onDelete={handleDelete} />
    </main>
  );
}
