'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { WardrobeItem } from '@/types';
import { VibeBadge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useDecryptedUrl } from '@/hooks/useDecryptedUrl';

interface ItemCardProps {
  item: WardrobeItem;
  onDelete?: (item: WardrobeItem) => void;
  onEdit?: boolean;
  selected?: boolean;
  onClick?: (item: WardrobeItem) => void;
  compact?: boolean;
}

export function ItemCard({ item, onDelete, onEdit, selected, onClick, compact }: ItemCardProps) {
  const src = useDecryptedUrl(item.imageUrl);
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
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={item.name ?? item.category}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-surface-2 animate-pulse" />
        )}
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

      {/* Action buttons */}
      <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <Link
            href={`/wardrobe/${item.id}/edit`}
            onClick={(e) => e.stopPropagation()}
            className="w-6 h-6 rounded-full bg-black/60 text-white/60 hover:text-accent hover:bg-black/80 transition-colors text-xs flex items-center justify-center"
          >
            ✎
          </Link>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            className="w-6 h-6 rounded-full bg-black/60 text-white/60 hover:text-red-400 hover:bg-black/80 transition-colors text-xs flex items-center justify-center"
          >
            ✕
          </button>
        )}
      </div>
    </motion.div>
  );
}
