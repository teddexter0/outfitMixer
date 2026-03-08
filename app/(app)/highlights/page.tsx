'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getHighlights, createHighlight, deleteHighlight } from '@/lib/firestore';
import { Highlight, HighlightType } from '@/types';
import { HighlightCard } from '@/components/highlights/HighlightCard';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { getCurrentWeekOf } from '@/lib/utils';

const PRESETS: { label: string; type: HighlightType }[] = [
  { label: 'Strathmore Week', type: 'strathmore-week' },
  { label: 'Chill Weekend', type: 'chill-weekend' },
  { label: 'Fancy Out', type: 'fancy-out' },
  { label: 'Home Fits', type: 'home' },
];

const EMPTY_DAYS = {
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
  sunday: null,
};

export default function HighlightsPage() {
  const { user } = useAuth();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [customName, setCustomName] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const load = async () => {
    if (!user) return;
    const data = await getHighlights(user.uid);
    setHighlights(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user]);

  const handleCreate = async (name: string, type: HighlightType) => {
    if (!user) return;
    setCreating(true);
    try {
      await createHighlight(user.uid, {
        name,
        type,
        days: EMPTY_DAYS,
        weekOf: getCurrentWeekOf(),
      });
      await load();
      setShowCreate(false);
      setCustomName('');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm('Delete this highlight?')) return;
    await deleteHighlight(user.uid, id);
    await load();
  };

  if (loading) return <PageLoader />;

  return (
    <main className="px-4 pt-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Highlights</h1>
        <Button size="sm" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? 'Cancel' : '+ New'}
        </Button>
      </div>

      {/* Create panel */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-surface-1 border border-surface-3 rounded-2xl p-4 space-y-4">
              <p className="text-sm font-medium text-white">Choose a preset</p>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map(({ label, type }) => (
                  <button
                    key={type}
                    onClick={() => handleCreate(label, type)}
                    disabled={creating}
                    className="py-2.5 px-3 bg-surface-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-surface-3 transition-colors text-left disabled:opacity-40"
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Custom name..."
                  className="flex-1 bg-surface-2 border border-surface-3 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50"
                />
                <Button
                  size="sm"
                  onClick={() => handleCreate(customName, 'custom')}
                  disabled={!customName.trim() || creating}
                >
                  Create
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {highlights.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-16">No highlights yet</p>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {highlights.map((hl) => (
              <HighlightCard key={hl.id} highlight={hl} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}
