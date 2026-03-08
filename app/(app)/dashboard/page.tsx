'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getHighlights, getOutfits, getItems } from '@/lib/firestore';
import { Highlight, Outfit, WardrobeItem, DayOfWeek } from '@/types';
import { WeekGrid } from '@/components/planner/WeekGrid';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { formatWeekOf } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [outfitMap, setOutfitMap] = useState<Record<string, Outfit>>({});
  const [itemMap, setItemMap] = useState<Record<string, WardrobeItem>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [hls, outfits, items] = await Promise.all([
        getHighlights(user.uid),
        getOutfits(user.uid),
        getItems(user.uid),
      ]);
      setHighlights(hls);
      setOutfitMap(Object.fromEntries(outfits.map((o) => [o.id, o])));
      setItemMap(Object.fromEntries(items.map((i) => [i.id, i])));
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <PageLoader />;

  const activeHighlight = highlights[0] ?? null;

  return (
    <main className="px-4 pt-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">This Week</h1>
          {activeHighlight && (
            <p className="text-sm text-white/40 mt-0.5">
              {formatWeekOf(activeHighlight.weekOf)}
            </p>
          )}
        </div>
        <Link href="/highlights">
          <Button variant="secondary" size="sm">
            Highlights
          </Button>
        </Link>
      </div>

      {/* Week grid */}
      {activeHighlight ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs text-white/40 mb-3 uppercase tracking-wider">
            {activeHighlight.name}
          </p>
          <WeekGrid
            highlight={activeHighlight}
            outfitMap={outfitMap}
            itemMap={itemMap}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 space-y-4"
        >
          <p className="text-white/30 text-sm">No highlight yet this week.</p>
          <Link href="/highlights">
            <Button>Create a Highlight</Button>
          </Link>
        </motion.div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Link href="/randomizer">
          <div className="bg-surface-1 border border-surface-3 rounded-2xl p-4 hover:border-accent/40 transition-colors">
            <div className="text-2xl mb-2">🎲</div>
            <p className="text-sm font-medium text-white">Mix Outfit</p>
            <p className="text-xs text-white/40 mt-0.5">Generate something to wear</p>
          </div>
        </Link>
        <Link href="/wardrobe/upload">
          <div className="bg-surface-1 border border-surface-3 rounded-2xl p-4 hover:border-accent/40 transition-colors">
            <div className="text-2xl mb-2">+</div>
            <p className="text-sm font-medium text-white">Add Item</p>
            <p className="text-xs text-white/40 mt-0.5">Upload a new piece</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
