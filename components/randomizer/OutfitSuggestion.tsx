'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { WardrobeItem } from '@/types';
import { GeneratedOutfit } from '@/lib/randomizer';
import { VibeBadge, FamilyBadge } from '@/components/ui/Badge';

interface OutfitSuggestionProps {
  outfit: GeneratedOutfit;
  itemMap: Record<string, WardrobeItem>;
}

const SLOT_ORDER: (keyof GeneratedOutfit['items'])[] = [
  'head',
  'top',
  'bottom',
  'shoes',
  'socks',
  'accessory',
];

const SLOT_LABELS: Record<string, string> = {
  head: 'Head',
  top: 'Top',
  bottom: 'Bottom',
  shoes: 'Shoes',
  socks: 'Socks',
  accessory: 'Acc.',
};

export function OutfitSuggestion({ outfit, itemMap }: OutfitSuggestionProps) {
  const slots = SLOT_ORDER.filter((slot) => outfit.items[slot] !== null);

  return (
    <motion.div
      key={JSON.stringify(outfit.items)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Item strip */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {slots.map((slot) => {
          const itemId = outfit.items[slot];
          if (!itemId) return null;
          const item = itemMap[itemId];
          if (!item) return null;

          return (
            <motion.div
              key={slot}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-none w-28"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-surface-2 relative">
                <Image
                  src={item.imageUrl}
                  alt={item.name ?? slot}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
              <div className="mt-1 space-y-0.5">
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                  {SLOT_LABELS[slot]}
                </p>
                <p className="text-xs text-white/80 truncate">{item.name ?? item.color}</p>
                <FamilyBadge family={item.colorFamily} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
