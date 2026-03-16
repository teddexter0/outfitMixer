'use client';

import { motion } from 'framer-motion';
import { Outfit, WardrobeItem, DayOfWeek } from '@/types';
import { cn } from '@/lib/utils';
import { useDecryptedUrl } from '@/hooks/useDecryptedUrl';

interface DaySlotProps {
  day: DayOfWeek;
  outfit: Outfit | null;
  itemMap: Record<string, WardrobeItem>;
  isToday?: boolean;
  onClick?: () => void;
}

const DAY_SHORT: Record<DayOfWeek, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

function DecryptedThumb({ imageUrl, alt }: { imageUrl: string; alt: string }) {
  const src = useDecryptedUrl(imageUrl);
  return (
    <div className="aspect-square rounded-lg overflow-hidden relative bg-surface-2">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-surface-2 animate-pulse" />
      )}
    </div>
  );
}

export function DaySlot({ day, outfit, itemMap, isToday, onClick }: DaySlotProps) {
  const topItem = outfit ? itemMap[outfit.items.top] : null;
  const bottomItem = outfit ? itemMap[outfit.items.bottom] : null;

  return (
    <motion.div
      whileTap={onClick ? { scale: 0.97 } : undefined}
      onClick={onClick}
      className={cn(
        'flex-none w-24 rounded-2xl border overflow-hidden transition-all',
        isToday ? 'border-accent' : 'border-surface-3',
        onClick && 'cursor-pointer hover:border-accent/50',
        'bg-surface-1'
      )}
    >
      {/* Day label */}
      <div
        className={cn(
          'px-2 py-1.5 text-center',
          isToday ? 'bg-accent text-surface' : 'bg-surface-2'
        )}
      >
        <p className={cn('text-xs font-semibold', isToday ? 'text-surface' : 'text-white/60')}>
          {DAY_SHORT[day]}
        </p>
      </div>

      {/* Outfit preview */}
      <div className="p-2 space-y-1">
        {outfit && topItem ? (
          <>
            <DecryptedThumb imageUrl={topItem.imageUrl} alt="top" />
            {bottomItem && <DecryptedThumb imageUrl={bottomItem.imageUrl} alt="bottom" />}
            <p className="text-[9px] text-white/30 text-center truncate">{outfit.vibeTag}</p>
          </>
        ) : (
          <div className="aspect-square rounded-lg bg-surface-2 flex items-center justify-center">
            <span className="text-white/20 text-lg">+</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
