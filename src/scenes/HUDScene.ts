import Phaser from 'phaser';
import type { Player } from '@/entities/Player';
import type { WaveSystem } from '@/systems/WaveSystem';

/**
 * HUD overlay scene — runs on top of GameScene.
 * Displays HP, wave timer, materials, XP, level.
 */
export class HUDScene extends Phaser.Scene {
  private hpBar!: Phaser.GameObjects.Graphics;
  private waveText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private materialsText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private xpBar!: Phaser.GameObjects.Graphics;
  private controllerIcon!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'HUD' });
  }

  create(): void {
    const pad = 16;

    // HP bar
    this.hpBar = this.add.graphics();

    // Wave indicator (top center)
    this.waveText = this.add.text(this.cameras.main.width / 2, pad, '', {
      fontSize: '24px',
      fontFamily: 'monospace',
      color: '#ffffff',
    }).setOrigin(0.5, 0);

    // Timer (below wave)
    this.timerText = this.add.text(this.cameras.main.width / 2, pad + 30, '', {
      fontSize: '36px',
      fontFamily: 'monospace',
      color: '#ffcc00',
    }).setOrigin(0.5, 0);

    // Materials (top right)
    this.materialsText = this.add.text(this.cameras.main.width - pad, pad, '', {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#44ff88',
      align: 'right',
    }).setOrigin(1, 0);

    // Level + XP bar (bottom center)
    this.levelText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - pad - 20, '', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#aaaaff',
    }).setOrigin(0.5, 0);

    this.xpBar = this.add.graphics();

    // Controller status (bottom right)
    this.controllerIcon = this.add.text(this.cameras.main.width - pad, this.cameras.main.height - pad, '', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#666666',
    }).setOrigin(1, 1);
  }

  updateHUD(player: Player, waveSystem: WaveSystem, controllerConnected: boolean): void {
    const { width, height } = this.cameras.main;
    const pad = 16;
    const stats = player.stats;

    // HP bar (top left)
    this.hpBar.clear();
    const hpBarWidth = 200;
    const hpBarHeight = 16;
    const hpX = pad;
    const hpY = pad;

    // Background
    this.hpBar.fillStyle(0x333333, 0.8);
    this.hpBar.fillRect(hpX, hpY, hpBarWidth, hpBarHeight);

    // HP fill
    const hpPct = Math.max(0, stats.hp / stats.maxHP);
    const hpColor = hpPct > 0.5 ? 0x44ff44 : hpPct > 0.25 ? 0xffaa00 : 0xff4444;
    this.hpBar.fillStyle(hpColor, 1);
    this.hpBar.fillRect(hpX, hpY, hpBarWidth * hpPct, hpBarHeight);

    // HP text
    this.hpBar.fillStyle(0xffffff, 1);
    // Border
    this.hpBar.lineStyle(1, 0xffffff, 0.5);
    this.hpBar.strokeRect(hpX, hpY, hpBarWidth, hpBarHeight);

    // Wave info
    this.waveText.setText(`Wave ${waveSystem.wave}/20`);

    // Timer
    const seconds = Math.ceil(waveSystem.waveTimer);
    if (waveSystem.waveActive) {
      this.timerText.setText(`${seconds}s`);
      this.timerText.setColor(seconds <= 5 ? '#ff4444' : '#ffcc00');
    } else {
      this.timerText.setText('');
    }

    // Materials
    this.materialsText.setText(`Materials: ${stats.materials}`);

    // Level + XP
    this.levelText.setText(`Lv ${stats.level}`);
    const xpBarWidth = 160;
    const xpBarHeight = 6;
    const xpX = width / 2 - xpBarWidth / 2;
    const xpY = height - pad - 14;

    this.xpBar.clear();
    this.xpBar.fillStyle(0x333333, 0.6);
    this.xpBar.fillRect(xpX, xpY, xpBarWidth, xpBarHeight);
    const xpPct = stats.xp / player.xpForNextLevel();
    this.xpBar.fillStyle(0x4488ff, 1);
    this.xpBar.fillRect(xpX, xpY, xpBarWidth * xpPct, xpBarHeight);

    // Controller
    this.controllerIcon.setText(controllerConnected ? 'Controller' : 'Keyboard');
    this.controllerIcon.setColor(controllerConnected ? '#44ff44' : '#888888');
  }
}
