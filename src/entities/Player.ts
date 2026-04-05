import Phaser from 'phaser';
import { PLAYER, ARENA } from '@/config/game-config';
import { xpForLevel } from '@/config/level-up-data';
import type { InputState } from '@/systems/GamepadSystem';

export interface PlayerStats {
  maxHP: number;
  hp: number;
  speed: number;
  armor: number;
  dodge: number; // 0-1 chance
  damage: number; // % multiplier (1.0 = 100%)
  meleeDamage: number;
  rangedDamage: number;
  attackSpeed: number; // multiplier
  critChance: number; // 0-1
  critMultiplier: number;
  lifeSteal: number; // flat HP per kill
  hpRegen: number; // HP per second
  range: number; // multiplier for weapon range
  luck: number; // affects item rarity
  harvesting: number; // bonus material drops
  engineering: number; // turret/structure damage
  materials: number;
  xp: number;
  level: number;
}

export function defaultStats(): PlayerStats {
  return {
    maxHP: PLAYER.BASE_HP,
    hp: PLAYER.BASE_HP,
    speed: PLAYER.BASE_SPEED,
    armor: 0,
    dodge: 0,
    damage: 1.0,
    meleeDamage: 0,
    rangedDamage: 0,
    attackSpeed: 1.0,
    critChance: 0.02,
    critMultiplier: 1.5,
    lifeSteal: 0,
    hpRegen: 0,
    range: 1.0,
    luck: 0,
    harvesting: 0,
    engineering: 0,
    materials: 0,
    xp: 0,
    level: 1,
  };
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  stats: PlayerStats;
  private invulnTimer = 0;
  private regenAccum = 0;
  private lastDamageFlash = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Create texture if it doesn't exist
    if (!scene.textures.exists('player')) {
      const g = scene.make.graphics({ x: 0, y: 0 }, false);
      // Body — rounded potato shape
      g.fillStyle(0xe8b84b, 1);
      g.fillCircle(PLAYER.RADIUS, PLAYER.RADIUS, PLAYER.RADIUS);
      // Eyes
      g.fillStyle(0x222222, 1);
      g.fillCircle(PLAYER.RADIUS - 5, PLAYER.RADIUS - 3, 2.5);
      g.fillCircle(PLAYER.RADIUS + 5, PLAYER.RADIUS - 3, 2.5);
      g.generateTexture('player', PLAYER.RADIUS * 2, PLAYER.RADIUS * 2);
      g.destroy();
    }

    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.stats = defaultStats();

    // Physics setup
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCircle(PLAYER.RADIUS);
    body.setCollideWorldBounds(false); // we handle bounds manually for arena
    body.setDrag(800, 800);
    body.setMaxVelocity(this.stats.speed);
  }

  applyInput(input: InputState): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const speed = this.stats.speed;

    body.setVelocity(input.moveX * speed, input.moveY * speed);

    // Clamp to arena bounds
    const r = PLAYER.RADIUS;
    this.x = Phaser.Math.Clamp(this.x, r, ARENA.WIDTH - r);
    this.y = Phaser.Math.Clamp(this.y, r, ARENA.HEIGHT - r);
  }

  update(_time: number, delta: number): void {
    const dt = delta / 1000;

    // Invulnerability countdown
    if (this.invulnTimer > 0) {
      this.invulnTimer -= delta;
      // Flash effect
      this.alpha = Math.sin(Date.now() * 0.02) > 0 ? 1 : 0.4;
    } else {
      this.alpha = 1;
    }

    // HP regen
    if (this.stats.hpRegen > 0 && this.stats.hp < this.stats.maxHP) {
      this.regenAccum += this.stats.hpRegen * dt;
      if (this.regenAccum >= 1) {
        const heal = Math.floor(this.regenAccum);
        this.stats.hp = Math.min(this.stats.hp + heal, this.stats.maxHP);
        this.regenAccum -= heal;
      }
    }
  }

  takeDamage(amount: number): boolean {
    if (this.invulnTimer > 0) return false;

    // Dodge check
    if (Math.random() < this.stats.dodge) return false;

    // Apply armor
    const armorReduction = 1 - this.stats.armor / 15;
    const finalDamage = Math.max(1, Math.round(amount * armorReduction));

    this.stats.hp -= finalDamage;
    this.invulnTimer = PLAYER.INVULN_MS;

    // Visual feedback — tint red briefly
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => this.clearTint());

    return true;
  }

  get isDead(): boolean {
    return this.stats.hp <= 0;
  }

  /** Pending level-ups accumulated during the wave, presented at wave end. */
  pendingLevelUps = 0;

  addXP(amount: number): boolean {
    this.stats.xp += amount;
    let leveled = false;
    while (this.stats.xp >= this.xpForNextLevel()) {
      this.stats.xp -= this.xpForNextLevel();
      this.stats.level++;
      this.pendingLevelUps++;
      leveled = true;
    }
    return leveled;
  }

  xpForNextLevel(): number {
    return xpForLevel(this.stats.level);
  }

  addMaterials(amount: number): void {
    const bonus = 1 + this.stats.harvesting * 0.05;
    this.stats.materials += Math.round(amount * bonus);
  }
}
