import { WardrobeItem, VibeTag, OutfitItems } from '@/types';
import { isOutfitCompatible } from './colorLogic';

function pickRandom<T>(arr: T[]): T | null {
  if (!arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function filterByVibe(items: WardrobeItem[], vibe: VibeTag): WardrobeItem[] {
  return items.filter((item) => item.vibeTags.includes(vibe));
}

export interface GeneratedOutfit {
  items: OutfitItems;
  itemObjects: Partial<Record<keyof OutfitItems, WardrobeItem>>;
}

export function generateOutfit(
  wardrobe: WardrobeItem[],
  vibe: VibeTag,
  maxAttempts = 5
): GeneratedOutfit | null {
  const byVibe = filterByVibe(wardrobe, vibe);

  const tops = byVibe.filter((i) => i.category === 'top');
  const bottoms = byVibe.filter((i) => i.category === 'bottom');
  const shoes = byVibe.filter((i) => i.category === 'shoes');
  const heads = byVibe.filter((i) => i.category === 'head');
  const socks = byVibe.filter((i) => i.category === 'socks');
  const accessories = byVibe.filter((i) => i.category === 'accessory');

  if (!tops.length || !bottoms.length || !shoes.length) return null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const top = pickRandom(tops)!;
    const bottom = pickRandom(bottoms)!;
    const shoe = pickRandom(shoes)!;
    const head = pickRandom(heads);
    const sock = pickRandom(socks);
    const accessory = pickRandom(accessories);

    const selected = [top, bottom, shoe, head, sock, accessory].filter(Boolean) as WardrobeItem[];
    const families = selected.map((i) => i.colorFamily);

    if (isOutfitCompatible(families)) {
      return {
        items: {
          top: top.id,
          bottom: bottom.id,
          shoes: shoe.id,
          head: head?.id ?? null,
          socks: sock?.id ?? null,
          accessory: accessory?.id ?? null,
        },
        itemObjects: {
          top,
          bottom,
          shoes: shoe,
          head: head ?? undefined,
          socks: sock ?? undefined,
          accessory: accessory ?? undefined,
        },
      };
    }
  }

  return null;
}
