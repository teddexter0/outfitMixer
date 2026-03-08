'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getHighlight, getOutfits, getItems, updateHighlightDay } from '@/lib/firestore';
import { Highlight, Outfit, WardrobeItem, DayOfWeek } from '@/types';
import { WeekGrid } from '@/components/planner/WeekGrid';
import { ItemCard } from '@/components/wardrobe/ItemCard';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { formatWeekOf } from '@/lib/utils';

const DAYS: DayOfWeek[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];

export default function HighlightDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null);

  const outfitMap = useMemo(
    () => Object.fromEntries(outfits.map((o) => [o.id, o])),
    [outfits]
  );
  const itemMap = useMemo(
    () => Object.fromEntries(items.map((i) => [i.id, i])),
    [items]
  );

  const load = async () => {
    if (!user) return;
    const [hl, os, is_] = await Promise.all([
      getHighlight(user.uid, id),
      getOutfits(user.uid),
      getItems(user.uid),
    ]);
    setHighlight(hl);
    setOutfits(os);
    setItems(is_);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user, id]);

  const handleAssignOutfit = async (outfitId: string) => {
    if (!user || !highlight || !selectedDay) return;
    await updateHighlightDay(user.uid, id, selectedDay, outfitId);
    await load();
    setSelectedDay(null);
  };

  const handleClearDay = async (day: DayOfWeek) => {
    if (!user || !highlight) return;
    await updateHighlightDay(user.uid, id, day, null);
    await load();
  };

  if (loading) return <PageLoader />;
  if (!highlight) return <p className="text-white/40 text-center pt-20">Not found</p>;

  return (
    <main className="px-4 pt-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-white/40 hover:text-white transition-colors text-sm"
        >
          ←
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">{highlight.name}</h1>
          <p className="text-xs text-white/40">{formatWeekOf(highlight.weekOf)}</p>
        </div>
      </div>

      {/* Week grid — tappable */}
      <WeekGrid
        highlight={highlight}
        outfitMap={outfitMap}
        itemMap={itemMap}
        onDayClick={(day) => setSelectedDay(selectedDay === day ? null : day)}
      />

      {/* Day actions */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white capitalize">{selectedDay}</p>
              {highlight.days[selectedDay] && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleClearDay(selectedDay)}
                >
                  Clear
                </Button>
              )}
            </div>

            <p className="text-xs text-white/40">Pick an outfit for {selectedDay}:</p>

            {outfits.length === 0 ? (
              <p className="text-white/30 text-sm">
                No saved outfits yet. Use the Mixer to generate some.
              </p>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {outfits.map((outfit) => {
                  const topItem = itemMap[outfit.items.top];
                  if (!topItem) return null;
                  return (
                    <button
                      key={outfit.id}
                      onClick={() => handleAssignOutfit(outfit.id)}
                      className="flex-none w-24 text-left"
                    >
                      <div
                        className={`rounded-xl border overflow-hidden transition-all ${
                          highlight.days[selectedDay] === outfit.id
                            ? 'border-accent'
                            : 'border-surface-3 hover:border-accent/50'
                        }`}
                      >
                        <ItemCard item={topItem} compact />
                      </div>
                      <p className="text-[9px] text-white/30 mt-1 truncate capitalize">
                        {outfit.vibeTag}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
