export interface WeaponDef {
  key: string;
  name: string;
  type: 'ranged' | 'melee';
  baseDamage: number;
  attackSpeed: number; // attacks per second
  range: number; // pixels
  projectileSpeed: number; // pixels per second (ranged only)
  projectileRadius: number;
  color: number;
  tier: 1 | 2 | 3 | 4;
}

export const WEAPONS: Record<string, WeaponDef> = {
  pistol: {
    key: 'pistol',
    name: 'Pistol',
    type: 'ranged',
    baseDamage: 5,
    attackSpeed: 1.5,
    range: 400,
    projectileSpeed: 1500,
    projectileRadius: 6,
    color: 0xffffff,
    tier: 1,
  },
  smg: {
    key: 'smg',
    name: 'SMG',
    type: 'ranged',
    baseDamage: 3,
    attackSpeed: 4,
    range: 300,
    projectileSpeed: 1800,
    projectileRadius: 5,
    color: 0xffaa00,
    tier: 1,
  },
  shotgun: {
    key: 'shotgun',
    name: 'Shotgun',
    type: 'ranged',
    baseDamage: 3,
    attackSpeed: 0.8,
    range: 250,
    projectileSpeed: 1200,
    projectileRadius: 5,
    color: 0xff4444,
    tier: 1,
  },
  shuriken: {
    key: 'shuriken',
    name: 'Shuriken',
    type: 'ranged',
    baseDamage: 4,
    attackSpeed: 2,
    range: 350,
    projectileSpeed: 1400,
    projectileRadius: 8,
    color: 0x8888ff,
    tier: 1,
  },
};

/** Shotgun fires multiple projectiles in a spread */
export const SHOTGUN_PELLETS = 5;
export const SHOTGUN_SPREAD_DEG = 30;
