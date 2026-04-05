# Phaser 3 Patterns

Architecture patterns used in this project.

## Scene Lifecycle

- `preload()` — load assets
- `create()` — instantiate objects
- `update(time, delta)` — game loop (called every frame)

## Arcade Physics

- `this.physics.add.sprite()` — physics-enabled sprite
- `this.physics.add.overlap()` / `collider()` — collision detection
- Bodies have velocity, drag, maxSpeed, bounce

## Groups

- `this.physics.add.group()` — pooled object groups (enemies, projectiles)
- Recycle with `group.get()` — pulls from pool or creates new

## Camera

- `this.cameras.main.startFollow(player)` — follow player
- `this.cameras.main.setBounds()` — limit to arena

## connections

- gamepad-api
