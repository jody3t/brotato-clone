import Phaser from 'phaser';
import { Pickup } from '@/entities/Pickup';

export class BootScene extends Phaser.Scene {
  private promptText!: Phaser.GameObjects.Text;
  private dotTimer = 0;
  private dots = '';

  constructor() {
    super({ key: 'Boot' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Title
    this.add.text(width / 2, height / 3, 'BROTATO CLONE', {
      fontSize: '48px',
      fontFamily: 'monospace',
      color: '#e8b84b',
    }).setOrigin(0.5);

    // Controller prompt
    this.promptText = this.add.text(width / 2, height / 2 + 40, '', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    // Instructions
    this.add.text(width / 2, height / 2 + 90, 'Press START / ENTER to begin', {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#666666',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 120, 'WASD or Left Stick to move', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#555555',
    }).setOrigin(0.5);

    // Pre-create pickup textures
    Pickup.createTextures(this);

    // Listen for gamepad connection
    this.input.gamepad?.once('connected', (pad: Phaser.Input.Gamepad.Gamepad) => {
      this.promptText.setText(`Controller connected: ${pad.id.substring(0, 40)}`);
      this.promptText.setColor('#44ff44');
    });

    // Check if already connected
    if (this.input.gamepad && this.input.gamepad.total > 0) {
      const pad = this.input.gamepad.getPad(0);
      if (pad) {
        this.promptText.setText(`Controller connected: ${pad.id.substring(0, 40)}`);
        this.promptText.setColor('#44ff44');
      }
    }

    // Keyboard start
    this.input.keyboard?.on('keydown-ENTER', () => this.startGame());
    this.input.keyboard?.on('keydown-SPACE', () => this.startGame());
  }

  update(_time: number, delta: number): void {
    // Animated waiting text
    this.dotTimer += delta;
    if (this.dotTimer > 500) {
      this.dotTimer = 0;
      this.dots = this.dots.length >= 3 ? '' : this.dots + '.';
      if (!this.input.gamepad || this.input.gamepad.total === 0) {
        this.promptText.setText(`Waiting for controller${this.dots}\n(or use keyboard)`);
      }
    }

    // Check gamepad start button
    if (this.input.gamepad && this.input.gamepad.total > 0) {
      const pad = this.input.gamepad.getPad(0);
      if (pad && (pad.buttons[9]?.pressed || pad.buttons[0]?.pressed)) {
        this.startGame();
      }
    }
  }

  private startGame(): void {
    this.scene.start('Game');
  }
}
