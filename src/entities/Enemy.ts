import Phaser from 'phaser';
import type { EnemyDef } from '@/config/enemy-data';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  def!: EnemyDef;
  hp!: number;
  maxHP!: number;
  damage!: number;
  moveSpeed!: number;
  private hpBar!: Phaser.GameObjects.Graphics;
  private contactCooldown = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, '__missing');
    // Actual init happens in spawn()
  }

  static createTexture(scene: Phaser.Scene, def: EnemyDef): void {
    const key = `enemy_${def.key}`;
    if (scene.textures.exists(key)) return;

    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    const r = def.radius;
    const d = r * 2;

    g.fillStyle(def.color, 1);
    // Different shapes per enemy for visual distinction
    switch (def.key) {
      case 'fly':
        // Diamond shape
        g.fillTriangle(r, 0, d, r, r, d);
        g.fillTriangle(r, 0, 0, r, r, d);
        break;
      case 'tree':
        // Square (sturdy)
        g.fillRect(0, 0, d, d);
        break;
      case 'worm':
        // Elongated oval
        g.fillEllipse(r, r, d * 1.3, d * 0.7);
        break;
      default:
        // Circle
        g.fillCircle(r, r, r);
    }

    // Eyes
    g.fillStyle(0x000000, 1);
    g.fillCircle(r - 3, r - 2, 1.5);
    g.fillCircle(r + 3, r - 2, 1.5);

    g.generateTexture(key, d + 8, d + 8);
    g.destroy();
  }

  spawn(def: EnemyDef, wave: number, x: number, y: number): void {
    this.def = def;
    this.maxHP = def.baseHP + def.hpPerWave * (wave - 1);
    this.hp = this.maxHP;
    this.damage = def.baseDamage + def.damagePerWave * (wave - 1);
    this.moveSpeed = Phaser.Math.Between(def.speedMin, def.speedMax);

    const textureKey = `enemy_${def.key}`;
    this.setTexture(textureKey);
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.enable = true;
      body.setCircle(def.radius, (this.width - def.radius * 2) / 2, (this.height - def.radius * 2) / 2);
    }

    this.contactCooldown = 0;

    // Create HP bar
    if (!this.hpBar) {
      this.hpBar = this.scene.add.graphics();
    }
    this.hpBar.setVisible(true);
  }

  moveToward(targetX: number, targetY: number): void {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setVelocity(
        Math.cos(angle) * this.moveSpeed,
        Math.sin(angle) * this.moveSpeed,
      );
    }
  }

  takeDamage(amount: number): boolean {
    this.hp -= amount;

    // Flash white on hit
    this.setTint(0xffffff);
    this.scene.time.delayedCall(50, () => {
      if (this.active) this.clearTint();
    });

    // Slight knockback
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.velocity.scale(0.3);
    }

    if (this.hp <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  canDealContactDamage(delta: number): boolean {
    if (this.contactCooldown > 0) {
      this.contactCooldown -= delta;
      return false;
    }
    this.contactCooldown = 500; // contact damage every 500ms
    return true;
  }

  private die(): void {
    this.setActive(false);
    this.setVisible(false);
    if (this.hpBar) this.hpBar.setVisible(false);
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.enable = false;
      body.setVelocity(0, 0);
    }
  }

  updateHPBar(): void {
    if (!this.hpBar || !this.active) return;
    this.hpBar.clear();

    const barWidth = this.def.radius * 2;
    const barHeight = 3;
    const x = this.x - barWidth / 2;
    const y = this.y - this.def.radius - 8;

    // Background
    this.hpBar.fillStyle(0x333333, 0.8);
    this.hpBar.fillRect(x, y, barWidth, barHeight);

    // HP fill
    const pct = this.hp / this.maxHP;
    const color = pct > 0.5 ? 0x44ff44 : pct > 0.25 ? 0xffaa00 : 0xff4444;
    this.hpBar.fillStyle(color, 1);
    this.hpBar.fillRect(x, y, barWidth * pct, barHeight);
  }

  destroy(fromScene?: boolean): void {
    if (this.hpBar) {
      this.hpBar.destroy();
    }
    super.destroy(fromScene);
  }
}
