'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Highlight } from '@/types';
import { formatWeekOf } from '@/lib/utils';
import { cn } from '@/lib/utils';

const TYPE_COLORS: Record<Highlight['type'], string> = {
  'strathmore-week': 'text-blue-400',
  'chill-weekend': 'text-green-400',
  'fancy-out': 'text-purple-400',
  home: 'text-amber-400',
  custom: 'text-accent',
};

interface HighlightCardProps {
  highlight: Highlight;
  onDelete?: (id: string) => void;
}

export function HighlightCard({ highlight, onDelete }: HighlightCardProps) {
  const filledDays = Object.values(highlight.days).filter(Boolean).length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="group bg-surface-1 border border-surface-3 rounded-2xl overflow-hidden hover:border-accent/30 transition-colors"
    >
      <Link href={`/highlights/${highlight.id}`} className="block p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-white">{highlight.name}</p>
            <p className={cn('text-xs mt-0.5 capitalize', TYPE_COLORS[highlight.type])}>
              {highlight.type.replace('-', ' ')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40">{formatWeekOf(highlight.weekOf)}</p>
            <p className="text-xs text-white/30 mt-0.5">{filledDays}/7 days</p>
          </div>
        </div>

        {/* Day dots */}
        <div className="flex gap-1.5 mt-3">
          {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map(
            (day) => (
              <div
                key={day}
                className={cn(
                  'w-6 h-1.5 rounded-full',
                  highlight.days[day] ? 'bg-accent' : 'bg-surface-3'
                )}
              />
            )
          )}
        </div>
      </Link>

      {onDelete && (
        <button
          onClick={() => onDelete(highlight.id)}
          className="w-full py-2 text-xs text-red-400/50 hover:text-red-400 hover:bg-red-950/20 transition-colors border-t border-surface-3 opacity-0 group-hover:opacity-100"
        >
          Delete highlight
        </button>
      )}
    </motion.div>
  );
}
