import Phaser from 'phaser';
import { WAVE, ARENA } from '@/config/game-config';
import { ENEMIES, WAVE_ENEMY_POOL, getEnemyCountForWave } from '@/config/enemy-data';
import type { EnemyDef } from '@/config/enemy-data';
import { Enemy } from '@/entities/Enemy';

export class WaveSystem {
  private scene: Phaser.Scene;
  private enemyGroup: Phaser.Physics.Arcade.Group;

  wave = 1;
  waveTimer = 0; // seconds remaining
  waveDuration = 0;
  waveActive = false;
  waveComplete = false;

  private spawnTimer = 0;
  private totalToSpawn = 0;
  private spawned = 0;

  constructor(scene: Phaser.Scene, enemyGroup: Phaser.Physics.Arcade.Group) {
    this.scene = scene;
    this.enemyGroup = enemyGroup;
  }

  startWave(): void {
    this.waveDuration = Math.min(
      WAVE.BASE_DURATION_S + (this.wave - 1) * WAVE.DURATION_INCREMENT_S,
      WAVE.MAX_DURATION_S,
    );
    this.waveTimer = this.waveDuration;
    this.totalToSpawn = getEnemyCountForWave(this.wave);
    this.spawned = 0;
    this.spawnTimer = 0;
    this.waveActive = true;
    this.waveComplete = false;

    // Pre-create enemy textures for this wave's pool
    const pool = this.getEnemyPool();
    for (const def of pool) {
      Enemy.createTexture(this.scene, def);
    }
  }

  update(delta: number, cameraX: number, cameraY: number, cameraW: number, cameraH: number): void {
    if (!this.waveActive) return;

    const dt = delta / 1000;
    this.waveTimer -= dt;

    // Spawn enemies over the wave duration
    if (this.spawned < this.totalToSpawn) {
      const spawnInterval = this.waveDuration / this.totalToSpawn;
      this.spawnTimer += dt;

      while (this.spawnTimer >= spawnInterval && this.spawned < this.totalToSpawn) {
        const activeCount = this.enemyGroup.countActive(true);
        if (activeCount < WAVE.MAX_ENEMIES_ON_SCREEN) {
          this.spawnEnemy(cameraX, cameraY, cameraW, cameraH);
        }
        this.spawnTimer -= spawnInterval;
        this.spawned++;
      }
    }

    // Wave ends when timer runs out AND all enemies are dead
    if (this.waveTimer <= 0) {
      this.waveTimer = 0;
      const activeEnemies = this.enemyGroup.countActive(true);
      if (activeEnemies === 0) {
        this.waveActive = false;
        this.waveComplete = true;
      }
    }
  }

  private spawnEnemy(camX: number, camY: number, camW: number, camH: number): void {
    const def = this.pickEnemyType();
    if (!def) return;

    // Spawn outside camera view
    const pos = this.getSpawnPosition(camX, camY, camW, camH);

    // Get or create enemy from group
    let enemy = this.enemyGroup.getFirstDead(false) as Enemy | null;
    if (!enemy) {
      enemy = new Enemy(this.scene, pos.x, pos.y);
      this.enemyGroup.add(enemy, true);
    }
    enemy.spawn(def, this.wave, pos.x, pos.y);
  }

  private pickEnemyType(): EnemyDef | null {
    const eligible = WAVE_ENEMY_POOL.filter(
      e => this.wave >= e.minWave && this.wave <= e.maxWave,
    );
    if (eligible.length === 0) return null;

    const totalWeight = eligible.reduce((sum, e) => sum + e.weight, 0);
    let roll = Math.random() * totalWeight;
    for (const entry of eligible) {
      roll -= entry.weight;
      if (roll <= 0) {
        const key = entry.enemies[Math.floor(Math.random() * entry.enemies.length)];
        return ENEMIES[key] ?? null;
      }
    }
    return null;
  }

  private getSpawnPosition(camX: number, camY: number, camW: number, camH: number): { x: number; y: number } {
    const margin = WAVE.SPAWN_MARGIN;
    // Pick a random edge
    const edge = Math.floor(Math.random() * 4);
    let x: number, y: number;

    switch (edge) {
      case 0: // top
        x = Phaser.Math.Between(camX - margin, camX + camW + margin);
        y = camY - margin;
        break;
      case 1: // bottom
        x = Phaser.Math.Between(camX - margin, camX + camW + margin);
        y = camY + camH + margin;
        break;
      case 2: // left
        x = camX - margin;
        y = Phaser.Math.Between(camY - margin, camY + camH + margin);
        break;
      default: // right
        x = camX + camW + margin;
        y = Phaser.Math.Between(camY - margin, camY + camH + margin);
    }

    // Clamp to arena
    x = Phaser.Math.Clamp(x, 0, ARENA.WIDTH);
    y = Phaser.Math.Clamp(y, 0, ARENA.HEIGHT);
    return { x, y };
  }

  private getEnemyPool(): EnemyDef[] {
    const eligible = WAVE_ENEMY_POOL.filter(
      e => this.wave >= e.minWave && this.wave <= e.maxWave,
    );
    const defs: EnemyDef[] = [];
    for (const entry of eligible) {
      for (const key of entry.enemies) {
        const d = ENEMIES[key];
        if (d) defs.push(d);
      }
    }
    return defs;
  }

  nextWave(): void {
    this.wave++;
  }
}
