import type { PlayerStats } from '@/entities/Player';

export interface StatEffect {
  stat: keyof PlayerStats;
  value: number;
}

export interface ItemDef {
  key: string;
  name: string;
  tier: 1 | 2 | 3 | 4;
  baseCost: number;
  effects: StatEffect[];
  description: string;
}

// Subset of real Brotato items — enough to feel right.
// Costs and effects match wiki data.

export const ITEMS: ItemDef[] = [
  // === TIER I ===
  {
    key: 'alien_worm', name: 'Alien Worm', tier: 1, baseCost: 15,
    effects: [{ stat: 'maxHP', value: 3 }, { stat: 'hpRegen', value: 2 }],
    description: '+3 Max HP, +2 HP Regen',
  },
  {
    key: 'beanie', name: 'Beanie', tier: 1, baseCost: 20,
    effects: [{ stat: 'speed', value: 20 }, { stat: 'range', value: -0.05 }],
    description: '+4% Speed, -6 Range',
  },
  {
    key: 'cake', name: 'Cake', tier: 1, baseCost: 15,
    effects: [{ stat: 'maxHP', value: 3 }],
    description: '+3 Max HP',
  },
  {
    key: 'coffee', name: 'Coffee', tier: 1, baseCost: 15,
    effects: [{ stat: 'attackSpeed', value: 0.10 }, { stat: 'damage', value: -0.02 }],
    description: '+10% Atk Speed, -2% Damage',
  },
  {
    key: 'glasses', name: 'Glasses', tier: 1, baseCost: 25,
    effects: [{ stat: 'range', value: 0.15 }],
    description: '+20 Range',
  },
  {
    key: 'helmet', name: 'Helmet', tier: 1, baseCost: 25,
    effects: [{ stat: 'armor', value: 1 }, { stat: 'speed', value: -10 }],
    description: '+1 Armor, -2% Speed',
  },
  {
    key: 'injection', name: 'Injection', tier: 1, baseCost: 20,
    effects: [{ stat: 'damage', value: 0.07 }, { stat: 'maxHP', value: -2 }],
    description: '+7% Damage, -2 Max HP',
  },
  {
    key: 'insanity', name: 'Insanity', tier: 1, baseCost: 20,
    effects: [{ stat: 'critChance', value: 0.06 }, { stat: 'damage', value: -0.03 }],
    description: '+6% Crit Chance, -3% Damage',
  },
  {
    key: 'mushroom', name: 'Mushroom', tier: 1, baseCost: 25,
    effects: [{ stat: 'hpRegen', value: 3 }, { stat: 'luck', value: -2 }],
    description: '+3 HP Regen, -2 Luck',
  },
  {
    key: 'plant', name: 'Plant', tier: 1, baseCost: 10,
    effects: [{ stat: 'hpRegen', value: 3 }],
    description: '+3 HP Regen',
  },
  {
    key: 'terrified_onion', name: 'Terrified Onion', tier: 1, baseCost: 15,
    effects: [{ stat: 'speed', value: 20 }, { stat: 'luck', value: -6 }],
    description: '+4% Speed, -6 Luck',
  },
  {
    key: 'coupon', name: 'Coupon', tier: 1, baseCost: 15,
    effects: [],
    description: '-5% item prices (passive)',
  },
  {
    key: 'hedgehog', name: 'Hedgehog', tier: 1, baseCost: 30,
    effects: [{ stat: 'meleeDamage', value: 2 }, { stat: 'rangedDamage', value: 1 }, { stat: 'hpRegen', value: -1 }],
    description: '+2 Melee, +1 Ranged, -1 HP Regen',
  },

  // === TIER II ===
  {
    key: 'acid', name: 'Acid', tier: 2, baseCost: 65,
    effects: [{ stat: 'maxHP', value: 8 }, { stat: 'dodge', value: -0.04 }],
    description: '+8 Max HP, -4% Dodge',
  },
  {
    key: 'banner', name: 'Banner', tier: 2, baseCost: 55,
    effects: [{ stat: 'range', value: 0.15 }, { stat: 'attackSpeed', value: 0.10 }],
    description: '+20 Range, +10% Atk Speed',
  },
  {
    key: 'blood_leech', name: 'Blood Leech', tier: 2, baseCost: 45,
    effects: [{ stat: 'lifeSteal', value: 2 }, { stat: 'hpRegen', value: 2 }, { stat: 'harvesting', value: -4 }],
    description: '+2 Life Steal, +2 HP Regen, -4 Harvesting',
  },
  {
    key: 'leather_vest', name: 'Leather Vest', tier: 2, baseCost: 45,
    effects: [{ stat: 'armor', value: 2 }, { stat: 'dodge', value: 0.06 }, { stat: 'maxHP', value: -3 }],
    description: '+2 Armor, +6% Dodge, -3 Max HP',
  },
  {
    key: 'medal', name: 'Medal', tier: 2, baseCost: 55,
    effects: [{ stat: 'maxHP', value: 3 }, { stat: 'damage', value: 0.03 }, { stat: 'armor', value: 1 }, { stat: 'speed', value: 15 }],
    description: '+3 HP, +3% Dmg, +1 Armor, +3% Speed',
  },
  {
    key: 'metal_plate', name: 'Metal Plate', tier: 2, baseCost: 40,
    effects: [{ stat: 'armor', value: 2 }, { stat: 'damage', value: -0.03 }],
    description: '+2 Armor, -3% Damage',
  },
  {
    key: 'missile', name: 'Missile', tier: 2, baseCost: 45,
    effects: [{ stat: 'damage', value: 0.10 }, { stat: 'attackSpeed', value: -0.04 }],
    description: '+10% Damage, -4% Atk Speed',
  },
  {
    key: 'gambling_token', name: 'Gambling Token', tier: 2, baseCost: 60,
    effects: [{ stat: 'dodge', value: 0.08 }, { stat: 'armor', value: -1 }],
    description: '+8% Dodge, -1 Armor',
  },

  // === TIER III ===
  {
    key: 'bloody_hand', name: 'Bloody Hand', tier: 3, baseCost: 75,
    effects: [{ stat: 'lifeSteal', value: 5 }, { stat: 'meleeDamage', value: 5 }, { stat: 'range', value: -0.15 }],
    description: '+5 Life Steal, +5 Melee, -20 Range',
  },
  {
    key: 'focus', name: 'Focus', tier: 3, baseCost: 90,
    effects: [{ stat: 'critChance', value: 0.25 }, { stat: 'attackSpeed', value: -0.10 }],
    description: '+25% Crit Chance, -10% Atk Speed',
  },
  {
    key: 'regeneration', name: 'Regeneration', tier: 3, baseCost: 85,
    effects: [{ stat: 'hpRegen', value: 8 }, { stat: 'maxHP', value: 5 }, { stat: 'damage', value: -0.04 }],
    description: '+8 HP Regen, +5 Max HP, -4% Dmg',
  },
  {
    key: 'riposte', name: 'Riposte', tier: 3, baseCost: 80,
    effects: [{ stat: 'armor', value: 4 }, { stat: 'critChance', value: -0.04 }],
    description: '+4 Armor, -4% Crit Chance',
  },
  {
    key: 'sniper_scope', name: 'Sniper Scope', tier: 3, baseCost: 90,
    effects: [{ stat: 'range', value: 0.35 }, { stat: 'rangedDamage', value: 5 }, { stat: 'speed', value: -20 }],
    description: '+45 Range, +5 Ranged, -4% Speed',
  },

  // === TIER IV ===
  {
    key: 'exoskeleton', name: 'Exoskeleton', tier: 4, baseCost: 140,
    effects: [{ stat: 'armor', value: 6 }, { stat: 'maxHP', value: 5 }, { stat: 'attackSpeed', value: -0.08 }],
    description: '+6 Armor, +5 Max HP, -8% Atk Speed',
  },
  {
    key: 'hunting_trophy', name: 'Hunting Trophy', tier: 4, baseCost: 110,
    effects: [{ stat: 'damage', value: 0.20 }, { stat: 'critChance', value: 0.10 }, { stat: 'armor', value: -2 }],
    description: '+20% Dmg, +10% Crit, -2 Armor',
  },
  {
    key: 'mammoth', name: 'Mammoth', tier: 4, baseCost: 130,
    effects: [{ stat: 'maxHP', value: 15 }, { stat: 'hpRegen', value: 4 }, { stat: 'speed', value: -30 }],
    description: '+15 Max HP, +4 HP Regen, -6% Speed',
  },
  {
    key: 'nuclear_launcher', name: 'Nuclear Launcher', tier: 4, baseCost: 150,
    effects: [{ stat: 'damage', value: 0.30 }, { stat: 'rangedDamage', value: 8 }, { stat: 'attackSpeed', value: -0.15 }],
    description: '+30% Dmg, +8 Ranged, -15% Atk Speed',
  },
];

/** Get items filtered by tier */
export function getItemsByTier(tier: number): ItemDef[] {
  return ITEMS.filter(i => i.tier === tier);
}

/**
 * Roll item tier based on wave and luck.
 * Returns tier 1-4.
 */
export function rollItemTier(wave: number, luck: number): number {
  const progress = Math.min(wave / 20, 1);
  const luckBonus = luck * 0.003;

  const t4 = Math.max(0, progress * 0.08 + luckBonus * 0.2);
  const t3 = Math.max(0, progress * 0.25 + luckBonus * 0.4);
  const t2 = Math.max(0, progress * 0.44 + luckBonus * 0.6);
  const t1 = Math.max(0.05, 1 - t2 - t3 - t4);

  const total = t1 + t2 + t3 + t4;
  let roll = Math.random() * total;

  if ((roll -= t4) < 0) return 4;
  if ((roll -= t3) < 0) return 3;
  if ((roll -= t2) < 0) return 2;
  return 1;
}

/**
 * Brotato shop pricing formula:
 * floor((baseCost + wave + (baseCost * 0.1 * wave)) * modifier)
 */
export function itemPrice(baseCost: number, wave: number): number {
  return Math.max(1, Math.floor(baseCost + wave + baseCost * 0.1 * wave));
}

/**
 * Shop reroll cost.
 * First reroll = floor(wave * 0.75) + increase
 * Each subsequent reroll costs +increase more
 */
export function shopRerollCost(wave: number, rerollCount: number): number {
  const increase = Math.max(1, Math.floor(wave * 0.40));
  return Math.floor(wave * 0.75) + increase * (rerollCount + 1);
}
