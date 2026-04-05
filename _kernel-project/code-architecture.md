# Code Architecture

## Stack

- **Phaser 3** — 2D game framework (arcade physics, scenes, sprites)
- **TypeScript** — Type safety
- **Vite** — Dev server + build
- **Gamepad API** — Browser-native controller input

## Directory Structure

```
src/
  main.ts              — Phaser game config + bootstrap
  config/
    game-config.ts     — Game constants (speeds, scaling, formulas)
    weapon-data.ts     — Weapon definitions
    enemy-data.ts      — Enemy type definitions
    item-data.ts       — Item definitions
    character-data.ts  — Character definitions
  scenes/
    BootScene.ts       — Asset loading + controller detection
    GameScene.ts       — Main gameplay loop
    ShopScene.ts       — Between-wave shop
    HUDScene.ts        — Overlay UI (HP, wave timer, stats)
  entities/
    Player.ts          — Player entity + movement
    Enemy.ts           — Enemy base class
    Projectile.ts      — Projectile entity
    Pickup.ts          — Material/XP drops
  systems/
    GamepadSystem.ts   — Controller input abstraction
    WaveSystem.ts      — Wave spawning + progression
    WeaponSystem.ts    — Weapon firing + management
    StatSystem.ts      — Player stat calculations
    DamageSystem.ts    — Damage formulas + armor
  ui/
    HealthBar.ts       — Player health display
    WaveTimer.ts       — Wave countdown
    ShopUI.ts          — Shop interface elements
```

## Key Patterns

- **Scene-based flow**: Boot → Game ↔ Shop (loop for 20 waves)
- **System architecture**: Game systems are standalone classes updated each frame
- **Controller-first**: All input goes through GamepadSystem, keyboard as fallback
- **Config-driven**: Enemy types, weapons, items defined as data, not code
