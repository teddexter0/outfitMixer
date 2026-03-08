'use client';

import { Highlight, Outfit, WardrobeItem, DayOfWeek } from '@/types';
import { DaySlot } from './DaySlot';

const DAYS: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

function getTodayKey(): DayOfWeek | null {
  const map: Record<number, DayOfWeek> = {
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
    0: 'sunday',
  };
  return map[new Date().getDay()] ?? null;
}

interface WeekGridProps {
  highlight: Highlight;
  outfitMap: Record<string, Outfit>;
  itemMap: Record<string, WardrobeItem>;
  onDayClick?: (day: DayOfWeek) => void;
}

export function WeekGrid({ highlight, outfitMap, itemMap, onDayClick }: WeekGridProps) {
  const today = getTodayKey();

  return (
    <div className="flex gap-3 overflow-x-auto pb-3">
      {DAYS.map((day) => {
        const outfitId = highlight.days[day];
        const outfit = outfitId ? outfitMap[outfitId] ?? null : null;
        return (
          <DaySlot
            key={day}
            day={day}
            outfit={outfit}
            itemMap={itemMap}
            isToday={day === today}
            onClick={onDayClick ? () => onDayClick(day) : undefined}
          />
        );
      })}
    </div>
  );
}
