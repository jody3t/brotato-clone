import Phaser from 'phaser';

export type PickupType = 'material' | 'xp';

export class Pickup extends Phaser.Physics.Arcade.Sprite {
  pickupType!: PickupType;
  value!: number;
  private magnetSpeed = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, '__missing');
  }

  static createTextures(scene: Phaser.Scene): void {
    if (!scene.textures.exists('pickup_material')) {
      const g = scene.make.graphics({ x: 0, y: 0 }, false);
      // Material — green diamond
      g.fillStyle(0x44ff88, 1);
      g.fillTriangle(6, 0, 12, 6, 6, 12);
      g.fillTriangle(6, 0, 0, 6, 6, 12);
      g.generateTexture('pickup_material', 12, 12);
      g.clear();

      // XP — blue circle
      g.fillStyle(0x4488ff, 1);
      g.fillCircle(5, 5, 5);
      g.fillStyle(0x66aaff, 0.5);
      g.fillCircle(5, 5, 7);
      g.generateTexture('pickup_xp', 14, 14);
      g.destroy();
    }
  }

  spawn(x: number, y: number, type: PickupType, value: number): void {
    this.setTexture(type === 'material' ? 'pickup_material' : 'pickup_xp');
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.pickupType = type;
    this.value = value;
    this.magnetSpeed = 0;

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.enable = true;
      body.setCircle(6);
      // Small random scatter on spawn
      body.setVelocity(
        Phaser.Math.Between(-60, 60),
        Phaser.Math.Between(-60, 60),
      );
      body.setDrag(120, 120);
    }
  }

  magnetToward(targetX: number, targetY: number, pickupRadius: number, snapDist: number): boolean {
    const dist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);

    if (dist < snapDist) {
      // Close enough — snap and collect
      this.deactivate();
      return true;
    }

    if (dist < pickupRadius) {
      // Kill physics velocity — we're lerping now
      const body = this.body as Phaser.Physics.Arcade.Body;
      if (body) body.setVelocity(0, 0);

      // Gentle magnet pull — slow ramp, accelerates as it gets closer
      this.magnetSpeed = Math.min(this.magnetSpeed + 0.015, 0.18);
      // Boost as pickup gets close (last 40% of range pulls faster)
      const closeness = 1 - dist / pickupRadius;
      const pull = this.magnetSpeed + closeness * 0.08;
      this.x = Phaser.Math.Linear(this.x, targetX, pull);
      this.y = Phaser.Math.Linear(this.y, targetY, pull);
    }

    return false;
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
