import { Timestamp } from 'firebase/firestore';

export type Category = 'head' | 'top' | 'bottom' | 'shoes' | 'socks' | 'accessory';

export type ColorFamily = 'neutral' | 'earth' | 'warm' | 'cool';

export type VibeTag = 'strathmore' | 'chill-weekend' | 'fancy-out' | 'home';

export type HighlightType = 'strathmore-week' | 'chill-weekend' | 'fancy-out' | 'home' | 'custom';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface WardrobeItem {
  id: string;
  userId: string;
  category: Category;
  name?: string;
  imageUrl: string;
  color: string;
  colorFamily: ColorFamily;
  vibeTags: VibeTag[];
  createdAt: Timestamp;
}

export interface OutfitItems {
  head: string | null;
  top: string;
  bottom: string;
  shoes: string;
  socks: string | null;
  accessory: string | null;
}

export interface Outfit {
  id: string;
  userId: string;
  items: OutfitItems;
  vibeTag: VibeTag;
  savedAt: Timestamp;
}

export interface WeekDays {
  monday: string | null;
  tuesday: string | null;
  wednesday: string | null;
  thursday: string | null;
  friday: string | null;
  saturday: string | null;
  sunday: string | null;
}

export interface Highlight {
  id: string;
  name: string;
  type: HighlightType;
  days: WeekDays;
  createdAt: Timestamp;
  weekOf: string;
}
