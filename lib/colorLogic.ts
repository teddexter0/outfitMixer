import { ColorFamily } from '@/types';

export const COLOR_FAMILY_MAP: Record<string, ColorFamily> = {
  // Neutrals
  white: 'neutral',
  black: 'neutral',
  grey: 'neutral',
  gray: 'neutral',
  beige: 'neutral',
  cream: 'neutral',
  ivory: 'neutral',
  silver: 'neutral',
  charcoal: 'neutral',

  // Earth tones
  brown: 'earth',
  tan: 'earth',
  olive: 'earth',
  camel: 'earth',
  khaki: 'earth',
  taupe: 'earth',
  sand: 'earth',
  rust: 'earth',

  // Warm tones
  red: 'warm',
  orange: 'warm',
  yellow: 'warm',
  burgundy: 'warm',
  maroon: 'warm',
  coral: 'warm',
  pink: 'warm',
  magenta: 'warm',
  gold: 'warm',

  // Cool tones
  blue: 'cool',
  navy: 'cool',
  green: 'cool',
  purple: 'cool',
  teal: 'cool',
  mint: 'cool',
  lavender: 'cool',
  indigo: 'cool',
  turquoise: 'cool',
  emerald: 'cool',
};

/**
 * Infer color family from a user-provided color string.
 * Checks if any known color keyword is contained in the label.
 */
export function inferColorFamily(colorLabel: string): ColorFamily {
  const lower = colorLabel.toLowerCase();
  for (const [keyword, family] of Object.entries(COLOR_FAMILY_MAP)) {
    if (lower.includes(keyword)) return family;
  }
  return 'neutral'; // safe default
}

type CompatResult = 'ok' | 'warn' | 'clash';

const COMPAT_TABLE: Record<ColorFamily, Record<ColorFamily, CompatResult>> = {
  neutral: { neutral: 'ok', earth: 'ok', warm: 'ok', cool: 'ok' },
  earth:   { neutral: 'ok', earth: 'ok', warm: 'ok', cool: 'warn' },
  warm:    { neutral: 'ok', earth: 'ok', warm: 'warn', cool: 'clash' },
  cool:    { neutral: 'ok', earth: 'warn', warm: 'clash', cool: 'ok' },
};

export function checkCompatibility(a: ColorFamily, b: ColorFamily): CompatResult {
  return COMPAT_TABLE[a][b];
}

/**
 * Given an array of color families from the selected items,
 * returns whether the full outfit is compatible.
 */
export function isOutfitCompatible(families: ColorFamily[]): boolean {
  for (let i = 0; i < families.length; i++) {
    for (let j = i + 1; j < families.length; j++) {
      const result = checkCompatibility(families[i], families[j]);
      if (result === 'clash') return false;
    }
  }
  return true;
}
