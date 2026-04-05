import Phaser from 'phaser';
import { ARENA, PLAYER, CAMERA } from '@/config/game-config';
import { WEAPONS } from '@/config/weapon-data';
import { Player } from '@/entities/Player';
import { Enemy } from '@/entities/Enemy';
import { Projectile } from '@/entities/Projectile';
import { Pickup } from '@/entities/Pickup';
import { GamepadSystem } from '@/systems/GamepadSystem';
import { WaveSystem } from '@/systems/WaveSystem';
import { WeaponSystem } from '@/systems/WeaponSystem';
import type { HUDScene } from '@/scenes/HUDScene';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private enemies!: Phaser.Physics.Arcade.Group;
  private projectiles!: Phaser.Physics.Arcade.Group;
  private pickups!: Phaser.Physics.Arcade.Group;

  private gamepadSystem!: GamepadSystem;
  private waveSystem!: WaveSystem;
  private weaponSystem!: WeaponSystem;
  private hudScene!: HUDScene;

  private gameOver = false;
  private waveEndDelay = 0;

  constructor() {
    super({ key: 'Game' });
  }

  create(): void {
    this.gameOver = false;

    // Arena background
    this.createArena();

    // Physics groups
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: false,
    });

    this.projectiles = this.physics.add.group({
      classType: Projectile,
      runChildUpdate: false,
    });

    this.pickups = this.physics.add.group({
      classType: Pickup,
      runChildUpdate: false,
    });

    // Player at center
    this.player = new Player(this, ARENA.WIDTH / 2, ARENA.HEIGHT / 2);

    // Systems
    this.gamepadSystem = new GamepadSystem(this);
    this.waveSystem = new WaveSystem(this, this.enemies);
    this.weaponSystem = new WeaponSystem(this, this.projectiles);

    // Start with a pistol
    this.weaponSystem.addWeapon(WEAPONS.pistol);

    // Camera — zoom out for wider view
    this.cameras.main.setZoom(CAMERA.ZOOM);
    this.cameras.main.startFollow(this.player, true, CAMERA.LERP, CAMERA.LERP);
    this.cameras.main.setBounds(0, 0, ARENA.WIDTH, ARENA.HEIGHT);

    // Collisions
    this.physics.add.overlap(
      this.projectiles,
      this.enemies,
      this.onProjectileHitEnemy as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    );

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.onPlayerTouchEnemy as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    );

    // Launch HUD
    this.scene.launch('HUD');
    this.hudScene = this.scene.get('HUD') as HUDScene;

    // Start wave 1
    this.waveSystem.startWave();
  }

  private createArena(): void {
    // Dark ground
    const bg = this.add.graphics();
    bg.fillStyle(0x1a1a2e, 1);
    bg.fillRect(0, 0, ARENA.WIDTH, ARENA.HEIGHT);

    // Grid pattern for spatial awareness
    bg.lineStyle(1, 0x2a2a4e, 0.3);
    const gridSize = 64;
    for (let x = 0; x <= ARENA.WIDTH; x += gridSize) {
      bg.lineBetween(x, 0, x, ARENA.HEIGHT);
    }
    for (let y = 0; y <= ARENA.HEIGHT; y += gridSize) {
      bg.lineBetween(0, y, ARENA.WIDTH, y);
    }

    // Arena border
    bg.lineStyle(3, 0x4444aa, 0.8);
    bg.strokeRect(2, 2, ARENA.WIDTH - 4, ARENA.HEIGHT - 4);
  }

  update(time: number, delta: number): void {
    if (this.gameOver) return;

    // Input
    const input = this.gamepadSystem.poll();

    // Player movement
    this.player.applyInput(input);
    this.player.update(time, delta);

    // Wave system
    const cam = this.cameras.main;
    this.waveSystem.update(
      delta,
      cam.scrollX,
      cam.scrollY,
      cam.width,
      cam.height,
    );

    // Weapons auto-fire
    this.weaponSystem.update(delta, this.player, this.enemies);

    // Update enemies — move toward player
    const activeEnemies = this.enemies.getChildren().filter(e => e.active) as Enemy[];
    for (const enemy of activeEnemies) {
      enemy.moveToward(this.player.x, this.player.y);
      enemy.updateHPBar();
    }

    // Update projectiles — check range
    const activeProjectiles = this.projectiles.getChildren().filter(p => p.active) as Projectile[];
    for (const proj of activeProjectiles) {
      proj.update();
    }

    // Pickups — magnet toward player
    const activePickups = this.pickups.getChildren().filter(p => p.active) as Pickup[];
    for (const pickup of activePickups) {
      const collected = pickup.magnetToward(this.player.x, this.player.y, PLAYER.PICKUP_RADIUS, PLAYER.PICKUP_SNAP);
      if (collected) {
        if (pickup.pickupType === 'material') {
          this.player.addMaterials(pickup.value);
        } else {
          const leveledUp = this.player.addXP(pickup.value);
          if (leveledUp) {
            this.showLevelUpFlash();
          }
        }
      }
    }

    // Check death
    if (this.player.isDead) {
      this.handleGameOver();
      return;
    }

    // Wave complete — transition to shop
    if (this.waveSystem.waveComplete) {
      this.waveEndDelay += delta;
      if (this.waveEndDelay > 1000) {
        this.waveEndDelay = 0;
        if (this.waveSystem.wave >= 20) {
          this.handleVictory();
        } else {
          this.goToShop();
        }
      }
    }

    // HUD
    this.hudScene?.updateHUD(this.player, this.waveSystem, this.gamepadSystem.connected);

    // Pause
    if (input.justPressed['START']) {
      // TODO: pause menu
    }
  }

  private onProjectileHitEnemy(
    projObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    enemyObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ): void {
    const proj = projObj as unknown as Projectile;
    const enemy = enemyObj as unknown as Enemy;
    if (!proj.active || !enemy.active) return;

    const killed = enemy.takeDamage(proj.damage);
    proj.deactivate();

    if (killed) {
      this.onEnemyKilled(enemy);
    }
  }

  private onPlayerTouchEnemy(
    _playerObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    enemyObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ): void {
    const enemy = enemyObj as unknown as Enemy;
    if (!enemy.active) return;

    // Contact damage with cooldown per enemy
    if (enemy.canDealContactDamage(0)) {
      this.player.takeDamage(enemy.damage);
    }
  }

  private onEnemyKilled(enemy: Enemy): void {
    const def = enemy.def;

    // Spawn material drops
    for (let i = 0; i < def.dropCount; i++) {
      let pickup = this.pickups.getFirstDead(false) as Pickup | null;
      if (!pickup) {
        pickup = new Pickup(this, enemy.x, enemy.y);
        this.pickups.add(pickup, true);
      }
      pickup.spawn(
        enemy.x + Phaser.Math.Between(-10, 10),
        enemy.y + Phaser.Math.Between(-10, 10),
        'material',
        1,
      );
    }

    // Spawn XP
    let xpPickup = this.pickups.getFirstDead(false) as Pickup | null;
    if (!xpPickup) {
      xpPickup = new Pickup(this, enemy.x, enemy.y);
      this.pickups.add(xpPickup, true);
    }
    xpPickup.spawn(enemy.x, enemy.y, 'xp', def.xp);

    // Life steal
    if (this.player.stats.lifeSteal > 0) {
      this.player.stats.hp = Math.min(
        this.player.stats.hp + this.player.stats.lifeSteal,
        this.player.stats.maxHP,
      );
    }
  }

  private showLevelUpFlash(): void {
    const flash = this.add.text(this.player.x, this.player.y - 40, 'LEVEL UP!', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#ffff00',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: flash,
      y: flash.y - 30,
      alpha: 0,
      duration: 800,
      onComplete: () => flash.destroy(),
    });
  }

  /**
   * Wave end flow (matches Brotato):
   * 1. Level-up screens (one per level gained) — pick stat upgrades
   * 2. Shop — buy items + weapons
   * 3. Next wave
   */
  private goToShop(): void {
    this.scene.pause('Game');

    const startShop = () => {
      this.scene.launch('Shop', {
        player: this.player,
        waveSystem: this.waveSystem,
        weaponSystem: this.weaponSystem,
        resumeCallback: () => {
          this.waveSystem.nextWave();
          this.waveSystem.startWave();
          this.scene.resume('Game');
        },
      });
    };

    // Level-ups first, then shop
    if (this.player.pendingLevelUps > 0) {
      this.scene.launch('LevelUp', {
        player: this.player,
        pendingLevels: this.player.pendingLevelUps,
        onComplete: () => {
          this.player.pendingLevelUps = 0;
          startShop();
        },
      });
    } else {
      startShop();
    }
  }

  private handleGameOver(): void {
    this.gameOver = true;
    this.physics.pause();

    const { width, height } = this.cameras.main;
    const cx = this.cameras.main.scrollX + width / 2;
    const cy = this.cameras.main.scrollY + height / 2;

    this.add.text(cx, cy - 30, 'GAME OVER', {
      fontSize: '48px',
      fontFamily: 'monospace',
      color: '#ff4444',
    }).setOrigin(0.5).setScrollFactor(0);

    this.add.text(cx, cy + 30, `Wave ${this.waveSystem.wave} | Level ${this.player.stats.level}`, {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#aaaaaa',
    }).setOrigin(0.5).setScrollFactor(0);

    this.add.text(cx, cy + 70, 'Press START / ENTER to restart', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#666666',
    }).setOrigin(0.5).setScrollFactor(0);

    this.input.keyboard?.once('keydown-ENTER', () => this.restartGame());
    if (this.input.gamepad) {
      this.time.addEvent({
        delay: 100,
        loop: true,
        callback: () => {
          const pad = this.input.gamepad?.getPad(0);
          if (pad?.buttons[9]?.pressed) this.restartGame();
        },
      });
    }
  }

  private handleVictory(): void {
    this.gameOver = true;
    this.physics.pause();

    const { width, height } = this.cameras.main;
    const cx = this.cameras.main.scrollX + width / 2;
    const cy = this.cameras.main.scrollY + height / 2;

    this.add.text(cx, cy - 30, 'VICTORY!', {
      fontSize: '48px',
      fontFamily: 'monospace',
      color: '#44ff44',
    }).setOrigin(0.5).setScrollFactor(0);

    this.add.text(cx, cy + 30, `Level ${this.player.stats.level} | Materials: ${this.player.stats.materials}`, {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#aaaaaa',
    }).setOrigin(0.5).setScrollFactor(0);
  }

  private restartGame(): void {
    this.scene.stop('HUD');
    this.scene.restart();
  }

  shutdown(): void {
    this.scene.stop('HUD');
  }
}
