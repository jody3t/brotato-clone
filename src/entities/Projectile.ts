import Phaser from 'phaser';
import type { WeaponDef } from '@/config/weapon-data';

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  weaponDef!: WeaponDef;
  damage!: number;
  private maxDistance!: number;
  private startX!: number;
  private startY!: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, '__missing');
  }

  static createTexture(scene: Phaser.Scene, key: string, radius: number, color: number): void {
    if (scene.textures.exists(key)) return;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(color, 1);
    g.fillCircle(radius, radius, radius);
    // Glow effect
    g.fillStyle(color, 0.3);
    g.fillCircle(radius, radius, radius * 1.5);
    g.generateTexture(key, radius * 3, radius * 3);
    g.destroy();
  }

  fire(weapon: WeaponDef, fromX: number, fromY: number, angle: number, damage: number, rangeMultiplier: number): void {
    const texKey = `proj_${weapon.key}`;
    Projectile.createTexture(this.scene, texKey, weapon.projectileRadius, weapon.color);

    this.setTexture(texKey);
    this.setPosition(fromX, fromY);
    this.setActive(true);
    this.setVisible(true);

    this.weaponDef = weapon;
    this.damage = damage;
    this.maxDistance = weapon.range * rangeMultiplier;
    this.startX = fromX;
    this.startY = fromY;

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.enable = true;
      body.setCircle(weapon.projectileRadius);
      body.setVelocity(
        Math.cos(angle) * weapon.projectileSpeed,
        Math.sin(angle) * weapon.projectileSpeed,
      );
    }
  }

  update(): void {
    if (!this.active) return;

    // Check if exceeded max range
    const dist = Phaser.Math.Distance.Between(this.startX, this.startY, this.x, this.y);
    if (dist > this.maxDistance) {
      this.deactivate();
    }
  }

  deactivate(): void {
    this.setActive(false);
    this.setVisible(false);
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.enable = false;
      body.setVelocity(0, 0);
    }
  }
}
