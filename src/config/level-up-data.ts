import type { PlayerStats } from '@/entities/Player';

/** Which stat key to modify and the display name */
export interface StatUpgradeDef {
  stat: keyof PlayerStats;
  label: string;
  /** Format string for display. %v = value. */
  format: string;
  /** Values per tier [I, II, III, IV] */
  tiers: [number, number, number, number];
}

/**
 * All possible stat upgrades offered at level-up.
 * Values from Brotato wiki.
 */
export const STAT_UPGRADES: StatUpgradeDef[] = [
  { stat: 'maxHP',        label: 'Max HP',        format: '+%v',     tiers: [3, 6, 9, 12] },
  { stat: 'hpRegen',      label: 'HP Regen',      format: '+%v/s',   tiers: [2, 3, 4, 5] },
  { stat: 'lifeSteal',    label: 'Life Steal',    format: '+%v%',    tiers: [1, 2, 3, 4] },
  { stat: 'damage',       label: 'Damage',        format: '+%v%',    tiers: [5, 8, 12, 16] },
  { stat: 'meleeDamage',  label: 'Melee Damage',  format: '+%v',     tiers: [2, 4, 6, 8] },
  { stat: 'rangedDamage',  label: 'Ranged Damage', format: '+%v',     tiers: [1, 2, 3, 4] },
  { stat: 'attackSpeed',  label: 'Attack Speed',  format: '+%v%',    tiers: [5, 10, 15, 20] },
  { stat: 'critChance',   label: 'Crit Chance',   format: '+%v%',    tiers: [3, 5, 7, 9] },
  { stat: 'engineering',  label: 'Engineering',   format: '+%v',     tiers: [2, 3, 4, 5] },
  { stat: 'range',        label: 'Range',         format: '+%v',     tiers: [15, 30, 45, 60] },
  { stat: 'armor',        label: 'Armor',         format: '+%v',     tiers: [1, 2, 3, 4] },
  { stat: 'dodge',        label: 'Dodge',         format: '+%v%',    tiers: [3, 6, 9, 12] },
  { stat: 'speed',        label: 'Speed',         format: '+%v%',    tiers: [3, 6, 9, 12] },
  { stat: 'luck',         label: 'Luck',          format: '+%v',     tiers: [5, 10, 15, 20] },
  { stat: 'harvesting',   label: 'Harvesting',    format: '+%v',     tiers: [5, 8, 10, 12] },
];

/** Guaranteed tier at specific levels */
export function getGuaranteedTier(level: number): number | null {
  if (level === 1) return 0; // Tier I
  if (level >= 5 && level < 10) return 1; // Tier II at 5
  if (level >= 10 && level < 25 && level % 5 === 0) return 2; // Tier III at 10,15,20
  if (level >= 25 && level % 5 === 0) return 3; // Tier IV at 25,30,35...
  return null;
}

/** Tier rarity colors */
export const TIER_COLORS = [
  '#cccccc', // Tier I — white/gray
  '#44aaff', // Tier II — blue
  '#cc44ff', // Tier III — purple
  '#ff8800', // Tier IV — orange
] as const;

export const TIER_NAMES = ['I', 'II', 'III', 'IV'] as const;

/**
 * Roll a tier index (0-3) based on level and luck.
 * Higher level + luck shifts distribution toward higher tiers.
 */
export function rollUpgradeTier(level: number, luck: number): number {
  const guaranteed = getGuaranteedTier(level);
  if (guaranteed !== null) return guaranteed;

  // Base weights shift with level, luck adds bonus
  const progress = Math.min(level / 30, 1); // 0 to 1 over 30 levels
  const luckBonus = luck * 0.005; // each luck point adds 0.5%

  const t4Weight = Math.max(0, progress * 0.12 + luckBonus * 0.3);
  const t3Weight = Math.max(0, progress * 0.25 + luckBonus * 0.5);
  const t2Weight = Math.max(0, progress * 0.40 + luckBonus);
  const t1Weight = Math.max(0.1, 1 - t2Weight - t3Weight - t4Weight);

  const total = t1Weight + t2Weight + t3Weight + t4Weight;
  let roll = Math.random() * total;

  if ((roll -= t4Weight) < 0) return 3;
  if ((roll -= t3Weight) < 0) return 2;
  if ((roll -= t2Weight) < 0) return 1;
  return 0;
}

/** Brotato XP formula: XP to reach level N = (N + 3)^2 */
export function xpForLevel(level: number): number {
  return (level + 3) * (level + 3);
}

/** Reroll cost for level-up screen. Simpler than shop — starts at 1, +1 per reroll. */
export function levelUpRerollCost(rerollCount: number): number {
  return 1 + rerollCount;
}
