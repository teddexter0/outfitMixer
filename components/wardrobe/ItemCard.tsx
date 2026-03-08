'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { WardrobeItem } from '@/types';
import { VibeBadge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface ItemCardProps {
  item: WardrobeItem;
  onDelete?: (item: WardrobeItem) => void;
  selected?: boolean;
  onClick?: (item: WardrobeItem) => void;
  compact?: boolean;
}

export function ItemCard({ item, onDelete, selected, onClick, compact }: ItemCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      onClick={() => onClick?.(item)}
      className={cn(
        'relative group rounded-2xl overflow-hidden bg-surface-1 border transition-all duration-200',
        selected ? 'border-accent shadow-lg shadow-accent/20' : 'border-surface-3',
        onClick && 'cursor-pointer hover:border-accent/50'
      )}
    >
      {/* Image */}
      <div className={cn('relative w-full', compact ? 'aspect-[3/4]' : 'aspect-square')}>
        <Image
          src={item.imageUrl}
          alt={item.name ?? item.category}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        {selected && (
          <div className="absolute inset-0 bg-accent/10 flex items-center justify-center">
            <span className="text-2xl">✓</span>
          </div>
        )}
      </div>

      {/* Info */}
      {!compact && (
        <div className="p-2">
          <p className="text-xs text-white/80 truncate">{item.name ?? item.category}</p>
          <p className="text-[10px] text-white/40 capitalize">{item.color}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {item.vibeTags.map((v) => (
              <VibeBadge key={v} vibe={v} />
            ))}
          </div>
        </div>
      )}

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white/60 hover:text-red-400 hover:bg-black/80 transition-colors text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center"
        >
          ✕
        </button>
      )}
    </motion.div>
  );
}
