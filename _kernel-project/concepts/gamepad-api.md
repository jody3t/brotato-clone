# Gamepad API

Browser-native controller input. No plugins needed.

## Key Facts

- Poll-based: read state in `requestAnimationFrame` / Phaser update loop
- Controllers must be interacted with after page load before browser exposes them
- Xbox "standard" mapping: left stick axes 0/1, A=0, B=1, X=2, Y=3, bumpers 4/5, triggers 6/7
- Each controller gets unique index — supports local multiplayer
- Dead zone: ~0.15 for analog sticks to prevent drift

## Phaser Integration

Phaser has built-in gamepad support via `this.input.gamepad`. Enable in game config:
```ts
input: { gamepad: true }
```

Access via `this.input.gamepad.getPad(0)` for first controller.

## connections

- phaser-patterns
