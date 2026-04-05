// Core game constants derived from Brotato mechanics

export const ARENA = {
  WIDTH: 1600,
  HEIGHT: 1600,
  BORDER: 32,
} as const;

export const DISPLAY = {
  WIDTH: 1024,
  HEIGHT: 768,
} as const;

export const CAMERA = {
  ZOOM: 0.6, // pull back for wider view
  LERP: 0.08, // follow smoothness
} as const;

export const PLAYER = {
  BASE_SPEED: 450,
  BASE_HP: 10,
  RADIUS: 16,
  PICKUP_RADIUS: 120,
  PICKUP_SNAP: 30, // snap-collect distance
  INVULN_MS: 200, // brief invulnerability after hit
} as const;

export const WAVE = {
  TOTAL_WAVES: 20,
  BASE_DURATION_S: 20,
  DURATION_INCREMENT_S: 5,
  MAX_DURATION_S: 60,
  MAX_ENEMIES_ON_SCREEN: 100,
  SPAWN_MARGIN: 200, // spawn this far outside the camera (accounts for zoom)
} as const;

export const DAMAGE = {
  // Armor formula: incoming * (1 - armor/15)
  ARMOR_DIVISOR: 15,
  // Minimum damage after armor
  MIN_DAMAGE: 1,
} as const;

export const XP = {
  BASE_PER_LEVEL: 5,
  GROWTH_PER_LEVEL: 3, // each level needs 3 more XP
} as const;

export const SHOP = {
  REROLL_BASE_COST: 2,
  ITEMS_SHOWN: 4,
} as const;

export const GAMEPAD = {
  DEAD_ZONE: 0.15,
  // Xbox standard mapping
  BUTTON: {
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    LB: 4,
    RB: 5,
    LT: 6,
    RT: 7,
    BACK: 8,
    START: 9,
    L_STICK: 10,
    R_STICK: 11,
    DPAD_UP: 12,
    DPAD_DOWN: 13,
    DPAD_LEFT: 14,
    DPAD_RIGHT: 15,
  },
  AXIS: {
    LEFT_X: 0,
    LEFT_Y: 1,
    RIGHT_X: 2,
    RIGHT_Y: 3,
  },
} as const;
