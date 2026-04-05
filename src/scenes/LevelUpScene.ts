import Phaser from 'phaser';
import type { Player } from '@/entities/Player';
import {
  STAT_UPGRADES,
  TIER_COLORS,
  TIER_NAMES,
  rollUpgradeTier,
  levelUpRerollCost,
} from '@/config/level-up-data';
import type { StatUpgradeDef } from '@/config/level-up-data';
import { GamepadSystem } from '@/systems/GamepadSystem';

interface UpgradeOption {
  def: StatUpgradeDef;
  tier: number; // 0-3
  value: number;
}

interface LevelUpData {
  player: Player;
  pendingLevels: number;
  onComplete: () => void;
}

export class LevelUpScene extends Phaser.Scene {
  private player!: Player;
  private pendingLevels!: number;
  private onComplete!: () => void;
  private gamepadSystem!: GamepadSystem;

  private options: UpgradeOption[] = [];
  private selectedIndex = 0;
  private rerollCount = 0;
  private inputCooldown = 0;

  // Display objects (cleared on reroll)
  private displayGroup!: Phaser.GameObjects.Group;
  private selector!: Phaser.GameObjects.Graphics;
  private rerollText!: Phaser.GameObjects.Text;
  private levelLabel!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'LevelUp' });
  }

  init(data: LevelUpData): void {
    this.player = data.player;
    this.pendingLevels = data.pendingLevels;
    this.onComplete = data.onComplete;
  }

  create(): void {
    this.gamepadSystem = new GamepadSystem(this);
    this.rerollCount = 0;
    this.inputCooldown = 300;
    this.displayGroup = this.add.group();
    this.selector = this.add.graphics();

    const { width, height } = this.cameras.main;

    // Background overlay
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85);

    // Title
    this.add.text(width / 2, 30, 'LEVEL UP', {
      fontSize: '32px', fontFamily: 'monospace', color: '#ffff00',
    }).setOrigin(0.5);

    this.levelLabel = this.add.text(width / 2, 65, '', {
      fontSize: '16px', fontFamily: 'monospace', color: '#aaaaaa',
    }).setOrigin(0.5);

    // Auto +1 Max HP notice
    this.add.text(width / 2, 90, '+1 Max HP (automatic)', {
      fontSize: '13px', fontFamily: 'monospace', color: '#44ff44',
    }).setOrigin(0.5);

    // Reroll info
    this.rerollText = this.add.text(width / 2, height - 70, '', {
      fontSize: '14px', fontFamily: 'monospace', color: '#888888',
    }).setOrigin(0.5);

    // Controls
    this.add.text(width / 2, height - 40, 'A/SPACE: Select  |  Y/R: Reroll', {
      fontSize: '13px', fontFamily: 'monospace', color: '#555555',
    }).setOrigin(0.5);

    // Keyboard
    this.input.keyboard?.on('keydown-SPACE', () => this.selectOption());
    this.input.keyboard?.on('keydown-ENTER', () => this.selectOption());
    this.input.keyboard?.on('keydown-R', () => this.reroll());
    this.input.keyboard?.on('keydown-UP', () => this.moveSelection(-1));
    this.input.keyboard?.on('keydown-DOWN', () => this.moveSelection(1));
    this.input.keyboard?.on('keydown-W', () => this.moveSelection(-1));
    this.input.keyboard?.on('keydown-S', () => this.moveSelection(1));

    this.showLevel();
  }

  private showLevel(): void {
    this.selectedIndex = 0;

    // Apply automatic +1 Max HP
    this.player.stats.maxHP += 1;
    this.player.stats.hp += 1;

    this.levelLabel.setText(
      `Level ${this.player.stats.level}  (${this.pendingLevels} remaining)`,
    );

    this.generateOptions();
    this.renderOptions();
    this.updateRerollText();
  }

  private generateOptions(): void {
    this.options = [];
    const used = new Set<string>();

    for (let i = 0; i < 4; i++) {
      // Pick a random stat not yet offered
      let def: StatUpgradeDef;
      let attempts = 0;
      do {
        def = STAT_UPGRADES[Math.floor(Math.random() * STAT_UPGRADES.length)];
        attempts++;
      } while (used.has(def.stat) && attempts < 50);
      used.add(def.stat);

      const tier = rollUpgradeTier(this.player.stats.level, this.player.stats.luck);
      const value = def.tiers[tier];

      this.options.push({ def, tier, value });
    }
  }

  private renderOptions(): void {
    // Clear previous
    this.displayGroup.clear(true, true);
    this.selector.clear();

    const { width } = this.cameras.main;
    const startY = 130;
    const optionHeight = 70;

    for (let i = 0; i < this.options.length; i++) {
      const opt = this.options[i];
      const y = startY + i * optionHeight;
      const tierColor = TIER_COLORS[opt.tier];
      const tierName = TIER_NAMES[opt.tier];

      // Tier badge
      const badge = this.add.text(width / 2 - 220, y + 4, tierName, {
        fontSize: '14px', fontFamily: 'monospace', color: tierColor,
        backgroundColor: '#222222', padding: { x: 4, y: 2 },
      });
      this.displayGroup.add(badge);

      // Stat name
      const label = this.add.text(width / 2 - 180, y, opt.def.label, {
        fontSize: '22px', fontFamily: 'monospace', color: tierColor,
      });
      this.displayGroup.add(label);

      // Value
      const valueStr = opt.def.format.replace('%v', String(opt.value));
      const valText = this.add.text(width / 2 + 200, y + 4, valueStr, {
        fontSize: '20px', fontFamily: 'monospace', color: tierColor,
      }).setOrigin(1, 0);
      this.displayGroup.add(valText);

      // Current value hint
      const current = this.player.stats[opt.def.stat];
      const hint = this.add.text(width / 2 - 180, y + 28, `Current: ${typeof current === 'number' ? Math.round(current * 100) / 100 : current}`, {
        fontSize: '11px', fontFamily: 'monospace', color: '#555555',
      });
      this.displayGroup.add(hint);
    }

    this.updateSelector();
  }

  private updateSelector(): void {
    this.selector.clear();
    const { width } = this.cameras.main;
    const startY = 130;
    const optionHeight = 70;
    const y = startY + this.selectedIndex * optionHeight - 6;

    this.selector.lineStyle(2, 0xffff00, 1);
    this.selector.strokeRect(width / 2 - 230, y, 460, optionHeight - 6);
  }

  private updateRerollText(): void {
    const cost = levelUpRerollCost(this.rerollCount);
    this.rerollText.setText(`Reroll: ${cost} materials  (have ${this.player.stats.materials})`);
    this.rerollText.setColor(this.player.stats.materials >= cost ? '#aaaaaa' : '#ff4444');
  }

  update(_time: number, delta: number): void {
    this.inputCooldown -= delta;
    if (this.inputCooldown > 0) return;

    const input = this.gamepadSystem.poll();

    if (input.moveY < -0.5 || input.justPressed['DPAD_UP']) {
      this.moveSelection(-1);
      this.inputCooldown = 180;
    } else if (input.moveY > 0.5 || input.justPressed['DPAD_DOWN']) {
      this.moveSelection(1);
      this.inputCooldown = 180;
    }

    if (input.justPressed['A']) {
      this.selectOption();
      this.inputCooldown = 250;
    }

    if (input.justPressed['Y']) {
      this.reroll();
      this.inputCooldown = 250;
    }
  }

  private moveSelection(dir: number): void {
    this.selectedIndex = Phaser.Math.Clamp(this.selectedIndex + dir, 0, this.options.length - 1);
    this.updateSelector();
  }

  private selectOption(): void {
    const opt = this.options[this.selectedIndex];
    if (!opt) return;

    // Apply the stat upgrade
    this.applyStat(opt);

    this.pendingLevels--;
    this.rerollCount = 0;

    if (this.pendingLevels > 0) {
      // Show next level-up
      this.showLevel();
    } else {
      // Done with all level-ups
      this.scene.stop('LevelUp');
      this.onComplete();
    }
  }

  private applyStat(opt: UpgradeOption): void {
    const stats = this.player.stats;
    const key = opt.def.stat;
    const val = opt.value;

    // Percentage stats stored as decimals need conversion
    switch (key) {
      case 'damage':
      case 'attackSpeed':
        (stats as any)[key] += val / 100;
        break;
      case 'dodge':
      case 'critChance':
        (stats as any)[key] += val / 100;
        break;
      case 'maxHP':
        stats.maxHP += val;
        stats.hp += val; // heal for the amount gained
        break;
      default:
        (stats as any)[key] += val;
    }
  }

  private reroll(): void {
    const cost = levelUpRerollCost(this.rerollCount);
    if (this.player.stats.materials < cost) return;

    this.player.stats.materials -= cost;
    this.rerollCount++;
    this.selectedIndex = 0;

    this.generateOptions();
    this.renderOptions();
    this.updateRerollText();
  }
}
