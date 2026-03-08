import { cn } from '@/lib/utils';
import { ColorFamily, VibeTag } from '@/types';

const vibeColors: Record<VibeTag, string> = {
  strathmore: 'bg-blue-900/40 text-blue-300 border-blue-800',
  'chill-weekend': 'bg-green-900/40 text-green-300 border-green-800',
  'fancy-out': 'bg-purple-900/40 text-purple-300 border-purple-800',
  home: 'bg-amber-900/40 text-amber-300 border-amber-800',
};

const familyColors: Record<ColorFamily, string> = {
  neutral: 'bg-surface-3 text-white/60 border-white/10',
  earth: 'bg-amber-950/50 text-amber-400 border-amber-900',
  warm: 'bg-red-950/50 text-red-400 border-red-900',
  cool: 'bg-blue-950/50 text-blue-400 border-blue-900',
};

export function VibeBadge({ vibe, className }: { vibe: VibeTag; className?: string }) {
  return (
    <span
      className={cn(
        'inline-block text-[10px] font-medium px-1.5 py-0.5 rounded border',
        vibeColors[vibe],
        className
      )}
    >
      {vibe}
    </span>
  );
}

export function FamilyBadge({ family, className }: { family: ColorFamily; className?: string }) {
  return (
    <span
      className={cn(
        'inline-block text-[10px] font-medium px-1.5 py-0.5 rounded border',
        familyColors[family],
        className
      )}
    >
      {family}
    </span>
  );
}
