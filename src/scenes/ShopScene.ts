import Phaser from 'phaser';
import type { Player } from '@/entities/Player';
import type { WaveSystem } from '@/systems/WaveSystem';
import type { WeaponSystem } from '@/systems/WeaponSystem';
import { WEAPONS } from '@/config/weapon-data';
import type { WeaponDef } from '@/config/weapon-data';
import { ITEMS, rollItemTier, getItemsByTier, itemPrice, shopRerollCost } from '@/config/item-data';
import type { ItemDef } from '@/config/item-data';
import { TIER_COLORS } from '@/config/level-up-data';
import { GamepadSystem } from '@/systems/GamepadSystem';

const SLOT_COUNT = 4;

interface ShopSlot {
  type: 'item' | 'weapon';
  item?: ItemDef;
  weapon?: WeaponDef;
  price: number;
  locked: boolean;
  bought: boolean;
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

  private slots: ShopSlot[] = [];
  private selectedIndex = 0;
  private rerollCount = 0;
  private inputCooldown = 0;

  // Display
  private slotGroup!: Phaser.GameObjects.Group;
  private selector!: Phaser.GameObjects.Graphics;
  private materialText!: Phaser.GameObjects.Text;
  private rerollText!: Phaser.GameObjects.Text;
  private weaponCountText!: Phaser.GameObjects.Text;

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
    this.rerollCount = 0;
    this.inputCooldown = 300;
    this.slotGroup = this.add.group();
    this.selector = this.add.graphics();

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.9);

    // Title
    this.add.text(width / 2, 25, 'SHOP', {
      fontSize: '30px', fontFamily: 'monospace', color: '#e8b84b',
    }).setOrigin(0.5);

    this.add.text(width / 2, 58, `Wave ${this.waveSystem.wave} complete`, {
      fontSize: '14px', fontFamily: 'monospace', color: '#777777',
    }).setOrigin(0.5);

    // Stats summary
    const s = this.player.stats;
    this.add.text(width / 2, 82, `HP ${s.hp}/${s.maxHP}  Armor ${s.armor}  Dmg ${Math.round(s.damage * 100)}%  AtkSpd ${Math.round(s.attackSpeed * 100)}%`, {
      fontSize: '12px', fontFamily: 'monospace', color: '#666666',
    }).setOrigin(0.5);

    // Materials
    this.materialText = this.add.text(width - 20, 25, '', {
      fontSize: '18px', fontFamily: 'monospace', color: '#44ff88',
    }).setOrigin(1, 0);

    // Weapon count
    this.weaponCountText = this.add.text(20, 25, '', {
      fontSize: '14px', fontFamily: 'monospace', color: '#8888ff',
    });

    // Reroll info
    this.rerollText = this.add.text(width / 2, height - 70, '', {
      fontSize: '14px', fontFamily: 'monospace', color: '#888888',
    }).setOrigin(0.5);

    // Controls
    this.add.text(width / 2, height - 45, 'A/SPACE: Buy  |  X/L: Lock  |  Y/R: Reroll', {
      fontSize: '12px', fontFamily: 'monospace', color: '#555555',
    }).setOrigin(0.5);
    this.add.text(width / 2, height - 25, 'START/ENTER: Continue to next wave', {
      fontSize: '12px', fontFamily: 'monospace', color: '#555555',
    }).setOrigin(0.5);

    // Generate initial shop
    this.generateSlots();
    this.renderSlots();
    this.updateHUD();

    // Keyboard
    this.input.keyboard?.on('keydown-ENTER', () => this.continueGame());
    this.input.keyboard?.on('keydown-SPACE', () => this.buySelected());
    this.input.keyboard?.on('keydown-R', () => this.reroll());
    this.input.keyboard?.on('keydown-L', () => this.toggleLock());
    this.input.keyboard?.on('keydown-UP', () => this.moveSelection(-1));
    this.input.keyboard?.on('keydown-DOWN', () => this.moveSelection(1));
    this.input.keyboard?.on('keydown-W', () => this.moveSelection(-1));
    this.input.keyboard?.on('keydown-S', () => this.moveSelection(1));
  }

  update(_time: number, delta: number): void {
    this.inputCooldown -= delta;
    if (this.inputCooldown > 0) return;

    const input = this.gamepadSystem.poll();

    // Menu navigation — edge-detected, exactly one move per push
    if (input.menuY === -1) {
      this.moveSelection(-1);
    } else if (input.menuY === 1) {
      this.moveSelection(1);
    }

    if (input.justPressed['A']) { this.buySelected(); this.inputCooldown = 250; }
    if (input.justPressed['X']) { this.toggleLock(); this.inputCooldown = 250; }
    if (input.justPressed['Y']) { this.reroll(); this.inputCooldown = 250; }
    if (input.justPressed['START']) { this.continueGame(); }
  }

  private generateSlots(): void {
    const wave = this.waveSystem.wave;
    const luck = this.player.stats.luck;
    const newSlots: ShopSlot[] = [];

    // Determine item/weapon distribution per Brotato rules
    const weaponSlotIndices = new Set<number>();

    if (wave <= 2) {
      // Exactly 2 weapons + 2 items
      weaponSlotIndices.add(0);
      weaponSlotIndices.add(1);
    } else if (wave <= 5) {
      // Guaranteed 1 weapon, rest rolled normally
      weaponSlotIndices.add(0);
      for (let i = 1; i < SLOT_COUNT; i++) {
        if (Math.random() < 0.35) weaponSlotIndices.add(i);
      }
    } else {
      // Each slot: 65% item, 35% weapon
      for (let i = 0; i < SLOT_COUNT; i++) {
        if (Math.random() < 0.35) weaponSlotIndices.add(i);
      }
    }

    for (let i = 0; i < SLOT_COUNT; i++) {
      // Keep locked slots from previous roll
      if (this.slots[i]?.locked && !this.slots[i].bought) {
        newSlots.push(this.slots[i]);
        continue;
      }

      if (weaponSlotIndices.has(i) && this.weaponSystem.weapons.length < 6) {
        // Weapon slot
        const weaponKeys = Object.keys(WEAPONS);
        const wKey = weaponKeys[Math.floor(Math.random() * weaponKeys.length)];
        const weapon = WEAPONS[wKey];
        const price = itemPrice(weapon.baseDamage * 8, wave); // weapon pricing
        newSlots.push({ type: 'weapon', weapon, price, locked: false, bought: false });
      } else {
        // Item slot
        const tier = rollItemTier(wave, luck);
        const pool = getItemsByTier(tier);
        if (pool.length === 0) {
          // Fallback to tier 1
          const fallback = getItemsByTier(1);
          const item = fallback[Math.floor(Math.random() * fallback.length)];
          newSlots.push({ type: 'item', item, price: itemPrice(item.baseCost, wave), locked: false, bought: false });
        } else {
          const item = pool[Math.floor(Math.random() * pool.length)];
          newSlots.push({ type: 'item', item, price: itemPrice(item.baseCost, wave), locked: false, bought: false });
        }
      }
    }

    this.slots = newSlots;
  }

  private renderSlots(): void {
    this.slotGroup.clear(true, true);
    this.selector.clear();

    const { width } = this.cameras.main;
    const startY = 115;
    const slotHeight = 85;

    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      const y = startY + i * slotHeight;

      if (slot.bought) {
        // Grayed out
        const sold = this.add.text(width / 2, y + 20, '— SOLD —', {
          fontSize: '16px', fontFamily: 'monospace', color: '#333333',
        }).setOrigin(0.5);
        this.slotGroup.add(sold);
        continue;
      }

      const isWeapon = slot.type === 'weapon';
      const name = isWeapon ? slot.weapon!.name : slot.item!.name;
      const tier = isWeapon ? slot.weapon!.tier : slot.item!.tier;
      const tierColor = TIER_COLORS[tier - 1];
      const desc = isWeapon
        ? `${slot.weapon!.type} — ${slot.weapon!.baseDamage} dmg, ${slot.weapon!.attackSpeed}/s`
        : slot.item!.description;

      // Lock indicator
      if (slot.locked) {
        const lockIcon = this.add.text(width / 2 - 250, y + 2, 'LOCK', {
          fontSize: '10px', fontFamily: 'monospace', color: '#ffaa00',
          backgroundColor: '#332200', padding: { x: 3, y: 1 },
        });
        this.slotGroup.add(lockIcon);
      }

      // Type badge
      const typeBadge = this.add.text(width / 2 - 220, y + 2, isWeapon ? 'WPN' : `T${tier}`, {
        fontSize: '11px', fontFamily: 'monospace', color: tierColor,
        backgroundColor: '#1a1a1a', padding: { x: 3, y: 1 },
      });
      this.slotGroup.add(typeBadge);

      // Name
      const nameText = this.add.text(width / 2 - 180, y, name, {
        fontSize: '20px', fontFamily: 'monospace', color: tierColor,
      });
      this.slotGroup.add(nameText);

      // Description
      const descText = this.add.text(width / 2 - 180, y + 28, desc, {
        fontSize: '12px', fontFamily: 'monospace', color: '#888888',
      });
      this.slotGroup.add(descText);

      // Effects detail for items
      if (!isWeapon && slot.item!.effects.length > 0) {
        const effectStrs = slot.item!.effects.map(e => {
          const sign = e.value >= 0 ? '+' : '';
          return `${sign}${e.value} ${e.stat}`;
        });
        const effectText = this.add.text(width / 2 - 180, y + 44, effectStrs.join('  '), {
          fontSize: '10px', fontFamily: 'monospace', color: '#556655',
        });
        this.slotGroup.add(effectText);
      }

      // Price
      const canAfford = this.player.stats.materials >= slot.price;
      const priceText = this.add.text(width / 2 + 220, y + 8, `${slot.price}`, {
        fontSize: '20px', fontFamily: 'monospace', color: canAfford ? '#44ff88' : '#ff4444',
      }).setOrigin(1, 0);
      this.slotGroup.add(priceText);
    }

    this.updateSelector();
  }

  private updateHUD(): void {
    this.materialText.setText(`Materials: ${this.player.stats.materials}`);
    this.weaponCountText.setText(`Weapons: ${this.weaponSystem.weapons.length}/6`);

    const cost = shopRerollCost(this.waveSystem.wave, this.rerollCount);
    const canAfford = this.player.stats.materials >= cost;
    this.rerollText.setText(`Reroll: ${cost} materials`);
    this.rerollText.setColor(canAfford ? '#aaaaaa' : '#ff4444');
  }

  private moveSelection(dir: number): void {
    // Skip bought slots
    let next = this.selectedIndex + dir;
    while (next >= 0 && next < this.slots.length && this.slots[next].bought) {
      next += dir;
    }
    if (next >= 0 && next < this.slots.length) {
      this.selectedIndex = next;
      this.updateSelector();
    }
  }

  private updateSelector(): void {
    this.selector.clear();
    const { width } = this.cameras.main;
    const startY = 115;
    const slotHeight = 85;
    const y = startY + this.selectedIndex * slotHeight - 6;

    this.selector.lineStyle(2, 0xe8b84b, 1);
    this.selector.strokeRect(width / 2 - 240, y, 480, slotHeight - 8);
  }

  private buySelected(): void {
    const slot = this.slots[this.selectedIndex];
    if (!slot || slot.bought) return;
    if (this.player.stats.materials < slot.price) return;

    // Spend materials
    this.player.stats.materials -= slot.price;
    slot.bought = true;

    // Apply effects
    if (slot.type === 'weapon' && slot.weapon) {
      this.weaponSystem.addWeapon(slot.weapon);
    } else if (slot.type === 'item' && slot.item) {
      for (const effect of slot.item.effects) {
        (this.player.stats as any)[effect.stat] += effect.value;
      }
      // If Max HP increased, also heal
      const hpEffects = slot.item.effects.filter(e => e.stat === 'maxHP' && e.value > 0);
      for (const e of hpEffects) {
        this.player.stats.hp += e.value;
      }
    }

    this.renderSlots();
    this.updateHUD();
  }

  private toggleLock(): void {
    const slot = this.slots[this.selectedIndex];
    if (!slot || slot.bought) return;
    slot.locked = !slot.locked;
    this.renderSlots();
  }

  private reroll(): void {
    const cost = shopRerollCost(this.waveSystem.wave, this.rerollCount);
    if (this.player.stats.materials < cost) return;

    this.player.stats.materials -= cost;
    this.rerollCount++;
    this.selectedIndex = 0;

    this.generateSlots();
    this.renderSlots();
    this.updateHUD();
  }

  private continueGame(): void {
    this.scene.stop('Shop');
    this.resumeCallback();
  }
}
