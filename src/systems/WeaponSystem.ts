import Phaser from 'phaser';
import type { WeaponDef } from '@/config/weapon-data';
import { SHOTGUN_PELLETS, SHOTGUN_SPREAD_DEG } from '@/config/weapon-data';
import { Projectile } from '@/entities/Projectile';
import type { Player } from '@/entities/Player';
import type { Enemy } from '@/entities/Enemy';

interface WeaponSlot {
  def: WeaponDef;
  cooldown: number; // time until next shot
}

export class WeaponSystem {
  private scene: Phaser.Scene;
  private projectileGroup: Phaser.Physics.Arcade.Group;
  weapons: WeaponSlot[] = [];

  constructor(scene: Phaser.Scene, projectileGroup: Phaser.Physics.Arcade.Group) {
    this.scene = scene;
    this.projectileGroup = projectileGroup;
  }

  addWeapon(def: WeaponDef): void {
    if (this.weapons.length >= 6) return; // max 6 weapons
    this.weapons.push({ def, cooldown: 0 });
  }

  update(delta: number, player: Player, enemies: Phaser.Physics.Arcade.Group): void {
    const dt = delta / 1000;

    for (const slot of this.weapons) {
      slot.cooldown -= dt;
      if (slot.cooldown <= 0) {
        const target = this.findNearestEnemy(player, enemies, slot.def.range * player.stats.range);
        if (target) {
          this.fire(slot, player, target);
          const atkSpeed = slot.def.attackSpeed * player.stats.attackSpeed;
          slot.cooldown = 1 / atkSpeed;
        }
      }
    }
  }

  private findNearestEnemy(
    player: Player,
    enemies: Phaser.Physics.Arcade.Group,
    maxRange: number,
  ): Enemy | null {
    let nearest: Enemy | null = null;
    let nearestDist = Infinity;

    const active = enemies.getChildren().filter(e => e.active) as Enemy[];
    for (const enemy of active) {
      const dist = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
      if (dist < maxRange && dist < nearestDist) {
        nearestDist = dist;
        nearest = enemy;
      }
    }
    return nearest;
  }

  private fire(slot: WeaponSlot, player: Player, target: Enemy): void {
    const { def } = slot;
    const angle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y);

    // Calculate damage
    let baseDamage = def.baseDamage * player.stats.damage;
    if (def.type === 'ranged') baseDamage += player.stats.rangedDamage;
    if (def.type === 'melee') baseDamage += player.stats.meleeDamage;

    // Crit check
    const isCrit = Math.random() < player.stats.critChance;
    if (isCrit) baseDamage *= player.stats.critMultiplier;

    const damage = Math.max(1, Math.round(baseDamage));

    if (def.key === 'shotgun') {
      // Shotgun fires spread
      const spreadRad = (SHOTGUN_SPREAD_DEG * Math.PI) / 180;
      const startAngle = angle - spreadRad / 2;
      const step = spreadRad / (SHOTGUN_PELLETS - 1);
      for (let i = 0; i < SHOTGUN_PELLETS; i++) {
        this.spawnProjectile(def, player.x, player.y, startAngle + step * i, damage, player.stats.range);
      }
    } else {
      this.spawnProjectile(def, player.x, player.y, angle, damage, player.stats.range);
    }
  }

  private spawnProjectile(
    def: WeaponDef,
    x: number,
    y: number,
    angle: number,
    damage: number,
    rangeMultiplier: number,
  ): void {
    let proj = this.projectileGroup.getFirstDead(false) as Projectile | null;
    if (!proj) {
      proj = new Projectile(this.scene, x, y);
      this.projectileGroup.add(proj, true);
    }
    proj.fire(def, x, y, angle, damage, rangeMultiplier);
  }
}
