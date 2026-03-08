'use client';

import { VibeTag } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const VIBES: VibeTag[] = ['strathmore', 'chill-weekend', 'fancy-out', 'home'];

interface RandomizerControlsProps {
  vibe: VibeTag;
  onVibeChange: (v: VibeTag) => void;
  onSuggest: () => void;
  onReshuffle: () => void;
  onAccept: () => void;
  hasOutfit: boolean;
  saving: boolean;
}

export function RandomizerControls({
  vibe,
  onVibeChange,
  onSuggest,
  onReshuffle,
  onAccept,
  hasOutfit,
  saving,
}: RandomizerControlsProps) {
  return (
    <div className="space-y-4">
      {/* Vibe selector */}
      <div>
        <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Vibe</p>
        <div className="flex flex-wrap gap-2">
          {VIBES.map((v) => (
            <button
              key={v}
              onClick={() => onVibeChange(v)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                vibe === v
                  ? 'bg-accent text-surface font-semibold'
                  : 'bg-surface-2 text-white/50 hover:text-white/80'
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        {!hasOutfit ? (
          <Button onClick={onSuggest} size="lg" className="flex-1">
            Suggest
          </Button>
        ) : (
          <>
            <Button onClick={onReshuffle} variant="secondary" size="lg" className="flex-1">
              Reshuffle
            </Button>
            <Button onClick={onAccept} size="lg" className="flex-1" disabled={saving}>
              {saving ? 'Saving...' : 'Accept'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
