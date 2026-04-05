---
title: "Phase 1: Feel It Out"
status: active
priority: high
one_liner: Core loop playable — iterating on projectile accuracy, pickup feel, and menu UX with controller
updated: 2026-04-05
---

# Phase 1: Feel It Out

Core loop is playable. Tuning feel before expanding content.

## Done

- Xbox controller movement (analog stick + dead zone, WASD fallback)
- Arena with camera follow (0.6x zoom for wide view)
- 5 enemy types with scaling HP/damage, generous hitboxes (visual + 30% collision margin)
- 4 ranged weapons auto-firing at nearest enemy, fast projectiles with subtle homing
- 20-wave system (20s→60s duration), enemy spawning outside camera
- Material/XP pickups with magnet collection (materials = XP, matching Brotato)
- Level-up scene: 4 tiered stat upgrades per level, reroll, guaranteed tiers at milestones
- Shop scene: real Brotato items (30 across 4 tiers) + weapons, pricing formula, reroll, lock
- HUD overlay (HP, wave timer, materials, XP bar, controller status)
- Menu edge-detection for controller (one move per stick push, no double-skip)

## Active Tuning

- Projectile accuracy when circling small enemies at close range — fast projectiles + subtle homing helps but not 100%
- Pickup magnet speed/feel — gentle pull with proximity acceleration
- Enemy visual size vs hitbox balance

## Remaining for Phase 1

- Pause menu
- Game over → restart flow polish
- Balance pass on wave difficulty curve
- Sound effects (currently silent)
