# Code Architecture

## Stack

- **Phaser 3** — 2D game framework (arcade physics, scenes, sprites)
- **TypeScript** — Type safety
- **Vite 5** — Dev server + build (Node 18 compatible)
- **Gamepad API** — Browser-native Xbox controller input via Phaser's gamepad plugin

## Directory Structure

```
src/
  main.ts                — Phaser game config + bootstrap, scene registration
  config/
    game-config.ts       — Arena size, player stats, wave timing, gamepad mapping
    weapon-data.ts       — 4 weapon definitions (pistol, SMG, shotgun, shuriken)
    enemy-data.ts        — 5 enemy types, wave pool weights, spawn count formula
    item-data.ts         — 30 Brotato items across 4 tiers, pricing/rarity formulas
    level-up-data.ts     — 15 stat upgrades with tier values, XP formula, rarity rolls
  scenes/
    BootScene.ts         — Title screen + controller detection
    GameScene.ts         — Main gameplay loop, collision handling, wave-end flow
    LevelUpScene.ts      — Per-level stat upgrade selection (4 options, reroll)
    ShopScene.ts         — Between-wave shop (items + weapons, reroll, lock)
    HUDScene.ts          — Overlay UI (HP bar, wave timer, materials, XP, level)
  entities/
    Player.ts            — Player sprite, 17-stat system, XP/level tracking, damage
    Enemy.ts             — Enemy sprite, HP bars, contact damage, death/drops
    Projectile.ts        — Projectile sprite, range limit, subtle homing nudge
    Pickup.ts            — Material/XP drops, magnet collection with lerp
  systems/
    GamepadSystem.ts     — Unified input (controller + keyboard), menu edge-detection
    WaveSystem.ts        — Wave spawning, timer, progression, enemy pool selection
    WeaponSystem.ts      — Auto-targeting, firing, damage calc, crit, shotgun spread
```

## Key Patterns

- **Scene flow**: Boot → Game ↔ (LevelUp → Shop) loop for 20 waves
- **Systems updated per frame**: GamepadSystem.poll(), WaveSystem.update(), WeaponSystem.update()
- **Controller-first**: GamepadSystem provides both continuous input (moveX/Y for gameplay) and edge-detected input (menuX/Y for UI navigation)
- **Config-driven**: Enemies, weapons, items, stat upgrades all defined as data objects
- **Generous hitboxes**: Enemy collision body is 30% larger than visual radius. Projectiles have subtle homing (8% angular correction per frame within 40-degree cone)
- **Brotato-accurate economy**: Materials = XP (same pickup grants both). XP formula `(level+3)^2`. Shop pricing `floor(baseCost + wave + baseCost * 0.1 * wave)`
