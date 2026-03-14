'use client';

import { AnimatePresence } from 'framer-motion';
import { WardrobeItem, Category, VibeTag } from '@/types';
import { ItemCard } from './ItemCard';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const CATEGORY_TABS: { label: string; value: Category | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Head', value: 'head' },
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Shoes', value: 'shoes' },
  { label: 'Socks', value: 'socks' },
  { label: 'Acc.', value: 'accessory' },
];

interface ItemGridProps {
  items: WardrobeItem[];
  onDelete?: (item: WardrobeItem) => void;
  onEdit?: boolean;
  selectedId?: string | null;
  onSelect?: (item: WardrobeItem) => void;
}

export function ItemGrid({ items, onDelete, onEdit, selectedId, onSelect }: ItemGridProps) {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const filtered =
    activeCategory === 'all' ? items : items.filter((i) => i.category === activeCategory);

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_TABS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveCategory(value)}
            className={cn(
              'flex-none px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              activeCategory === value
                ? 'bg-accent text-surface font-semibold'
                : 'bg-surface-2 text-white/50 hover:text-white/80'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-12">No items yet</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onDelete={onDelete}
                onEdit={onEdit}
                selected={selectedId === item.id}
                onClick={onSelect}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
