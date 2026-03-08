'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useWardrobe } from '@/hooks/useWardrobe';
import { saveOutfit } from '@/lib/firestore';
import { generateOutfit, GeneratedOutfit } from '@/lib/randomizer';
import { VibeTag, WardrobeItem } from '@/types';
import { OutfitSuggestion } from '@/components/randomizer/OutfitSuggestion';
import { RandomizerControls } from '@/components/randomizer/RandomizerControls';
import { PageLoader } from '@/components/ui/LoadingSpinner';

export default function RandomizerPage() {
  const { user } = useAuth();
  const { items, loading } = useWardrobe();
  const [vibe, setVibe] = useState<VibeTag>('strathmore');
  const [outfit, setOutfit] = useState<GeneratedOutfit | null>(null);
  const [noResult, setNoResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const itemMap = useMemo(
    () => Object.fromEntries(items.map((i) => [i.id, i])),
    [items]
  );

  const handleSuggest = () => {
    const result = generateOutfit(items, vibe);
    setOutfit(result);
    setNoResult(!result);
  };

  const handleReshuffle = () => {
    handleSuggest();
  };

  const handleAccept = async () => {
    if (!user || !outfit) return;
    setSaving(true);
    try {
      await saveOutfit(user.uid, {
        items: outfit.items,
        vibeTag: vibe,
      });
      router.push('/dashboard');
    } finally {
      setSaving(false);
    }
  };

  const handleVibeChange = (v: VibeTag) => {
    setVibe(v);
    setOutfit(null);
    setNoResult(false);
  };

  if (loading) return <PageLoader />;

  return (
    <main className="px-4 pt-8 space-y-6">
      <h1 className="text-2xl font-bold text-white">Outfit Mixer</h1>

      <RandomizerControls
        vibe={vibe}
        onVibeChange={handleVibeChange}
        onSuggest={handleSuggest}
        onReshuffle={handleReshuffle}
        onAccept={handleAccept}
        hasOutfit={!!outfit}
        saving={saving}
      />

      {/* Result area */}
      <AnimatePresence mode="wait">
        {noResult && (
          <motion.div
            key="no-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8 text-white/40 text-sm space-y-2"
          >
            <p>No compatible outfit found for <strong className="text-white/60">{vibe}</strong>.</p>
            <p className="text-xs">Try adding more items to your wardrobe or switch the vibe.</p>
          </motion.div>
        )}

        {outfit && (
          <motion.div
            key="outfit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <p className="text-xs text-white/40 uppercase tracking-wider">Suggested outfit</p>
            <OutfitSuggestion outfit={outfit} itemMap={itemMap} />
          </motion.div>
        )}

        {!outfit && !noResult && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 text-white/20 text-sm"
          >
            Hit Suggest to mix an outfit
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
