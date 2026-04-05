import Phaser from 'phaser';
import type { Player, PlayerStats } from '@/entities/Player';
import type { WaveSystem } from '@/systems/WaveSystem';
import type { WeaponSystem } from '@/systems/WeaponSystem';
import { WEAPONS } from '@/config/weapon-data';
import type { WeaponDef } from '@/config/weapon-data';
import { SHOP } from '@/config/game-config';
import { GamepadSystem } from '@/systems/GamepadSystem';

interface ShopItem {
  name: string;
  description: string;
  cost: number;
  type: 'stat' | 'weapon';
  apply: (player: Player, weaponSystem: WeaponSystem) => void;
}

interface ShopData {
  player: Player;
  waveSystem: WaveSystem;
  weaponSystem: WeaponSystem;
  resumeCallback: () => void;
}

export class ShopScene extends Phaser.Scene {
  private player!: Player;
  private waveSystem!: WaveSystem;
  private weaponSystem!: WeaponSystem;
  private resumeCallback!: () => void;
  private gamepadSystem!: GamepadSystem;

  private items: ShopItem[] = [];
  private selectedIndex = 0;
  private itemTexts: Phaser.GameObjects.Text[] = [];
  private materialText!: Phaser.GameObjects.Text;
  private selector!: Phaser.GameObjects.Graphics;
  private inputCooldown = 0;

  constructor() {
    super({ key: 'Shop' });
  }

  init(data: ShopData): void {
    this.player = data.player;
    this.waveSystem = data.waveSystem;
    this.weaponSystem = data.weaponSystem;
    this.resumeCallback = data.resumeCallback;
  }

  create(): void {
    const { width, height } = this.cameras.main;
    this.gamepadSystem = new GamepadSystem(this);
    this.selectedIndex = 0;
    this.inputCooldown = 300; // prevent accidental immediate input

    // Darken background
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85);

    // Title
    this.add.text(width / 2, 40, `SHOP — Wave ${this.waveSystem.wave} Complete`, {
      fontSize: '28px',
      fontFamily: 'monospace',
      color: '#e8b84b',
    }).setOrigin(0.5);

    // Player stats summary
    const stats = this.player.stats;
    this.add.text(width / 2, 80, `HP: ${stats.hp}/${stats.maxHP}  |  Armor: ${stats.armor}  |  Speed: ${stats.speed}`, {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#888888',
    }).setOrigin(0.5);

    // Generate shop items
    this.items = this.generateItems();

    // Render items
    this.selector = this.add.graphics();
    this.itemTexts = [];

    const startY = 140;
    const itemHeight = 80;

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const y = startY + i * itemHeight;

      const nameText = this.add.text(width / 2 - 200, y, item.name, {
        fontSize: '20px',
        fontFamily: 'monospace',
        color: '#ffffff',
      });

      this.add.text(width / 2 - 200, y + 24, item.description, {
        fontSize: '13px',
        fontFamily: 'monospace',
        color: '#aaaaaa',
      });

      const costColor = stats.materials >= item.cost ? '#44ff88' : '#ff4444';
      this.add.text(width / 2 + 200, y + 8, `${item.cost}`, {
        fontSize: '18px',
        fontFamily: 'monospace',
        color: costColor,
      }).setOrigin(1, 0);

      this.itemTexts.push(nameText);
    }

    // Materials display
    this.materialText = this.add.text(width / 2, height - 80, `Materials: ${stats.materials}`, {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#44ff88',
    }).setOrigin(0.5);

    // Continue button
    this.add.text(width / 2, height - 40, 'Press START / ENTER to continue  |  A / SPACE to buy', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#666666',
    }).setOrigin(0.5);

    // Keyboard
    this.input.keyboard?.on('keydown-ENTER', () => this.continueGame());
    this.input.keyboard?.on('keydown-SPACE', () => this.buySelected());
    this.input.keyboard?.on('keydown-UP', () => this.moveSelection(-1));
    this.input.keyboard?.on('keydown-DOWN', () => this.moveSelection(1));
    this.input.keyboard?.on('keydown-W', () => this.moveSelection(-1));
    this.input.keyboard?.on('keydown-S', () => this.moveSelection(1));

    this.updateSelector();
  }

  update(_time: number, delta: number): void {
    this.inputCooldown -= delta;
    if (this.inputCooldown > 0) return;

    const input = this.gamepadSystem.poll();

    // Navigate with stick/dpad
    if (input.moveY < -0.5 || input.justPressed['DPAD_UP']) {
      this.moveSelection(-1);
      this.inputCooldown = 200;
    } else if (input.moveY > 0.5 || input.justPressed['DPAD_DOWN']) {
      this.moveSelection(1);
      this.inputCooldown = 200;
    }

    // Buy with A
    if (input.justPressed['A']) {
      this.buySelected();
      this.inputCooldown = 200;
    }

    // Continue with Start
    if (input.justPressed['START']) {
      this.continueGame();
    }
  }

  private generateItems(): ShopItem[] {
    const items: ShopItem[] = [];
    const wave = this.waveSystem.wave;
    const baseCost = 5 + wave * 2;

    // Stat upgrade pool
    const statPool: ShopItem[] = [
      {
        name: '+2 Max HP',
        description: 'Increases maximum health',
        cost: baseCost,
        type: 'stat',
        apply: (p) => { p.stats.maxHP += 2; p.stats.hp += 2; },
      },
      {
        name: '+1 Armor',
        description: 'Reduces incoming damage',
        cost: baseCost + 3,
        type: 'stat',
        apply: (p) => { p.stats.armor += 1; },
      },
      {
        name: '+30 Speed',
        description: 'Move faster',
        cost: baseCost,
        type: 'stat',
        apply: (p) => { p.stats.speed += 30; },
      },
      {
        name: '+10% Damage',
        description: 'All weapons deal more damage',
        cost: baseCost + 2,
        type: 'stat',
        apply: (p) => { p.stats.damage += 0.1; },
      },
      {
        name: '+15% Attack Speed',
        description: 'All weapons fire faster',
        cost: baseCost + 2,
        type: 'stat',
        apply: (p) => { p.stats.attackSpeed += 0.15; },
      },
      {
        name: '+5% Crit Chance',
        description: 'Chance for double damage',
        cost: baseCost + 1,
        type: 'stat',
        apply: (p) => { p.stats.critChance += 0.05; },
      },
      {
        name: '+1 HP Regen',
        description: 'Regenerate 1 HP per second',
        cost: baseCost + 1,
        type: 'stat',
        apply: (p) => { p.stats.hpRegen += 1; },
      },
      {
        name: '+1 Life Steal',
        description: 'Gain 1 HP per kill',
        cost: baseCost + 4,
        type: 'stat',
        apply: (p) => { p.stats.lifeSteal += 1; },
      },
      {
        name: '+5% Dodge',
        description: 'Chance to avoid damage',
        cost: baseCost + 3,
        type: 'stat',
        apply: (p) => { p.stats.dodge += 0.05; },
      },
      {
        name: '+20% Range',
        description: 'Weapons reach further',
        cost: baseCost,
        type: 'stat',
        apply: (p) => { p.stats.range += 0.2; },
      },
    ];

    // Weapon purchases
    const weaponPool: ShopItem[] = Object.values(WEAPONS).map(w => ({
      name: `${w.name} (Tier ${w.tier})`,
      description: `${w.type === 'ranged' ? 'Ranged' : 'Melee'} — ${w.baseDamage} dmg, ${w.attackSpeed}/s`,
      cost: baseCost + 10,
      type: 'weapon' as const,
      apply: (_p: Player, ws: WeaponSystem) => { ws.addWeapon(w); },
    }));

    // Pick random selection
    const shuffled = [...statPool].sort(() => Math.random() - 0.5);
    items.push(...shuffled.slice(0, SHOP.ITEMS_SHOWN - 1));

    // Always offer one weapon if player has slots
    if (this.weaponSystem.weapons.length < 6) {
      const randomWeapon = weaponPool[Math.floor(Math.random() * weaponPool.length)];
      items.push(randomWeapon);
    } else {
      items.push(shuffled[SHOP.ITEMS_SHOWN - 1]);
    }

    return items;
  }

  private moveSelection(dir: number): void {
    this.selectedIndex = Phaser.Math.Clamp(
      this.selectedIndex + dir,
      0,
      this.items.length - 1,
    );
    this.updateSelector();
  }

  private updateSelector(): void {
    this.selector.clear();
    const { width } = this.cameras.main;
    const startY = 140;
    const itemHeight = 80;
    const y = startY + this.selectedIndex * itemHeight - 8;

    this.selector.lineStyle(2, 0xe8b84b, 1);
    this.selector.strokeRect(width / 2 - 220, y, 440, itemHeight - 8);
  }

  private buySelected(): void {
    const item = this.items[this.selectedIndex];
    if (!item) return;

    if (this.player.stats.materials >= item.cost) {
      this.player.stats.materials -= item.cost;
      item.apply(this.player, this.weaponSystem);
      this.materialText.setText(`Materials: ${this.player.stats.materials}`);

      // Flash feedback
      const text = this.itemTexts[this.selectedIndex];
      if (text) {
        text.setColor('#44ff44');
        this.time.delayedCall(200, () => text.setColor('#666666'));
      }
    }
  }

  private continueGame(): void {
    this.scene.stop('Shop');
    this.resumeCallback();
  }
}
