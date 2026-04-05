# Brotato Clone

@_kernel-team/CLAUDE.md
@_kernel-user/CLAUDE.md

## First turn + re-read as needed

- `_kernel-project/threads/_index.md` — thread signposts
- `_kernel-project/concepts/_index.md` — concept signposts
- `_kernel-project/code-architecture.md` — code orientation

---

## Project

Brotato-style roguelike arena survivor. Web-based with Xbox controller support.
Phaser 3 / TypeScript / Vite. Multiplayer planned via WebSockets + Tailscale.

---

## Decisions

**Phaser 3** — Full-featured 2D game framework with arcade physics, scene management, sprite system.
**Vite** — Fast dev server, HMR, simple config.
**Gamepad API** — Browser-native controller input, poll-based in game loop. Xbox standard mapping.
**Placeholder graphics** — Geometric shapes with distinct visual language. Smooth animation > pretty sprites.
**Clone-first** — Replicate Brotato mechanics faithfully before modifying. Fun baseline before experimentation.
**500-line limit** — Extract when files grow past ~500 lines.
