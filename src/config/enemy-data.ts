export interface EnemyDef {
  key: string;
  name: string;
  baseHP: number;
  hpPerWave: number;
  baseDamage: number;
  damagePerWave: number;
  speedMin: number;
  speedMax: number;
  radius: number;
  color: number;
  /** How many materials this enemy drops */
  dropCount: number;
  /** XP granted on kill */
  xp: number;
}

export const ENEMIES: Record<string, EnemyDef> = {
  baby_alien: {
    key: 'baby_alien',
    name: 'Baby Alien',
    baseHP: 5,
    hpPerWave: 3,
    baseDamage: 1,
    damagePerWave: 1,
    speedMin: 200,
    speedMax: 300,
    radius: 10,
    color: 0x66ff66,
    dropCount: 1,
    xp: 1,
  },
  fly: {
    key: 'fly',
    name: 'Fly',
    baseHP: 3,
    hpPerWave: 2,
    baseDamage: 1,
    damagePerWave: 0,
    speedMin: 325,
    speedMax: 375,
    radius: 8,
    color: 0xcccc00,
    dropCount: 1,
    xp: 1,
  },
  tree: {
    key: 'tree',
    name: 'Tree',
    baseHP: 10,
    hpPerWave: 5,
    baseDamage: 2,
    damagePerWave: 1,
    speedMin: 80,
    speedMax: 120,
    radius: 18,
    color: 0x228b22,
    dropCount: 2,
    xp: 2,
  },
  bug: {
    key: 'bug',
    name: 'Bug',
    baseHP: 7,
    hpPerWave: 4,
    baseDamage: 1,
    damagePerWave: 1,
    speedMin: 150,
    speedMax: 220,
    radius: 12,
    color: 0x8b4513,
    dropCount: 1,
    xp: 1,
  },
  worm: {
    key: 'worm',
    name: 'Worm',
    baseHP: 15,
    hpPerWave: 6,
    baseDamage: 3,
    damagePerWave: 1,
    speedMin: 60,
    speedMax: 100,
    radius: 14,
    color: 0xff69b4,
    dropCount: 3,
    xp: 3,
  },
};

/** Which enemies can appear per wave range */
export const WAVE_ENEMY_POOL: { minWave: number; maxWave: number; enemies: string[]; weight: number }[] = [
  { minWave: 1, maxWave: 20, enemies: ['baby_alien'], weight: 3 },
  { minWave: 1, maxWave: 20, enemies: ['fly'], weight: 2 },
  { minWave: 1, maxWave: 20, enemies: ['bug'], weight: 2 },
  { minWave: 3, maxWave: 20, enemies: ['tree'], weight: 2 },
  { minWave: 5, maxWave: 20, enemies: ['worm'], weight: 1 },
];

/** How many enemies spawn per wave */
export function getEnemyCountForWave(wave: number): number {
  return Math.min(10 + wave * 5, 100);
}
