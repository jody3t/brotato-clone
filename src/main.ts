import Phaser from 'phaser';
import { DISPLAY } from '@/config/game-config';
import { BootScene } from '@/scenes/BootScene';
import { GameScene } from '@/scenes/GameScene';
import { LevelUpScene } from '@/scenes/LevelUpScene';
import { ShopScene } from '@/scenes/ShopScene';
import { HUDScene } from '@/scenes/HUDScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: DISPLAY.WIDTH,
  height: DISPLAY.HEIGHT,
  parent: document.body,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  input: {
    gamepad: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, GameScene, LevelUpScene, ShopScene, HUDScene],
};

new Phaser.Game(config);
