# Gamepad API

Browser-native controller input. No plugins needed.

## Key Facts

- Poll-based: read state in Phaser's update loop via `this.input.gamepad`
- Controllers must be interacted with after page load before browser exposes them
- Xbox "standard" mapping: left stick axes 0/1, A=0, B=1, X=2, Y=3, bumpers 4/5, triggers 6/7
- Each controller gets unique index — supports local multiplayer
- Dead zone: 0.15 for analog sticks to prevent drift

## Implementation Patterns

**Dual input modes in GamepadSystem:**
- `moveX`/`moveY` — continuous analog values for gameplay movement
- `menuX`/`menuY` — edge-detected (-1/0/1), fires once per stick push for UI navigation
- `justPressed` — button transitions (pressed && !wasPrev)
- `held` — current button state

**Menu edge detection:** Track stick "zone" (neutral/up/down/left/right). Only fire menuY/menuX on the *transition* from neutral to a zone. Holding the stick = exactly one move. Prevents double-skip in menus.

**Controller connection:** Phaser's `input.gamepad.once('connected')` event, with fallback check for already-connected pads on scene create.

## connections

- phaser-patterns
