import { GAMEPAD } from '@/config/game-config';

export interface InputState {
  moveX: number; // -1 to 1
  moveY: number; // -1 to 1
  /** Menu navigation — fires once per stick push / dpad press. Use in UI. */
  menuX: -1 | 0 | 1;
  menuY: -1 | 0 | 1;
  /** True on the frame the button was first pressed */
  justPressed: Record<string, boolean>;
  /** True while the button is held */
  held: Record<string, boolean>;
}

/**
 * Unified input system — controller first, keyboard fallback.
 * Polls gamepad state each frame via the Gamepad API.
 */
export class GamepadSystem {
  private scene: Phaser.Scene;
  private pad: Phaser.Input.Gamepad.Gamepad | null = null;
  private prevButtons: boolean[] = [];
  private keys: Record<string, Phaser.Input.Keyboard.Key> = {};
  private _connected = false;
  /** Previous stick zone for edge detection: -1/0/1 */
  private prevStickX: -1 | 0 | 1 = 0;
  private prevStickY: -1 | 0 | 1 = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.setupKeyboard();
    this.setupGamepad();
  }

  get connected(): boolean {
    return this._connected;
  }

  private setupKeyboard(): void {
    if (!this.scene.input.keyboard) return;
    const kb = this.scene.input.keyboard;
    this.keys = {
      up: kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      up2: kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down2: kb.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      left2: kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right2: kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      action: kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      secondary: kb.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
      confirm: kb.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
      cancel: kb.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
    };
  }

  private setupGamepad(): void {
    if (!this.scene.input.gamepad) return;

    this.scene.input.gamepad.once('connected', (pad: Phaser.Input.Gamepad.Gamepad) => {
      this.pad = pad;
      this._connected = true;
      this.prevButtons = pad.buttons.map(() => false);
    });

    // Check if already connected
    if (this.scene.input.gamepad.total > 0) {
      this.pad = this.scene.input.gamepad.getPad(0);
      if (this.pad) {
        this._connected = true;
        this.prevButtons = this.pad.buttons.map(() => false);
      }
    }
  }

  poll(): InputState {
    const state: InputState = {
      moveX: 0,
      moveY: 0,
      menuX: 0,
      menuY: 0,
      justPressed: {},
      held: {},
    };

    if (this.pad && this._connected) {
      this.pollGamepad(state);
    } else {
      this.pollKeyboard(state);
    }

    // Edge-detect stick zones for menu navigation
    const MENU_THRESHOLD = 0.5;
    const zoneX: -1 | 0 | 1 = state.moveX < -MENU_THRESHOLD ? -1 : state.moveX > MENU_THRESHOLD ? 1 : 0;
    const zoneY: -1 | 0 | 1 = state.moveY < -MENU_THRESHOLD ? -1 : state.moveY > MENU_THRESHOLD ? 1 : 0;

    // Only fire menu movement on the frame the stick enters a new zone
    if (zoneX !== 0 && zoneX !== this.prevStickX) state.menuX = zoneX;
    if (zoneY !== 0 && zoneY !== this.prevStickY) state.menuY = zoneY;

    // D-pad justPressed also counts as menu input
    if (state.justPressed['DPAD_UP']) state.menuY = -1;
    if (state.justPressed['DPAD_DOWN']) state.menuY = 1;
    if (state.justPressed['DPAD_LEFT']) state.menuX = -1;
    if (state.justPressed['DPAD_RIGHT']) state.menuX = 1;

    this.prevStickX = zoneX;
    this.prevStickY = zoneY;

    return state;
  }

  private pollGamepad(state: InputState): void {
    const pad = this.pad!;

    // Analog stick movement with dead zone
    const rawX = pad.axes[GAMEPAD.AXIS.LEFT_X]?.getValue() ?? 0;
    const rawY = pad.axes[GAMEPAD.AXIS.LEFT_Y]?.getValue() ?? 0;
    state.moveX = this.applyDeadZone(rawX);
    state.moveY = this.applyDeadZone(rawY);

    // Button states
    const buttonNames = Object.keys(GAMEPAD.BUTTON) as (keyof typeof GAMEPAD.BUTTON)[];
    for (const name of buttonNames) {
      const idx = GAMEPAD.BUTTON[name];
      const pressed = pad.buttons[idx]?.pressed ?? false;
      const wasPrev = this.prevButtons[idx] ?? false;
      state.held[name] = pressed;
      state.justPressed[name] = pressed && !wasPrev;
    }

    // Update previous state
    this.prevButtons = pad.buttons.map(b => b.pressed);
  }

  private pollKeyboard(state: InputState): void {
    // WASD / Arrow movement (digital, so full -1/0/1)
    let mx = 0;
    let my = 0;
    if (this.keys.left?.isDown || this.keys.left2?.isDown) mx -= 1;
    if (this.keys.right?.isDown || this.keys.right2?.isDown) mx += 1;
    if (this.keys.up?.isDown || this.keys.up2?.isDown) my -= 1;
    if (this.keys.down?.isDown || this.keys.down2?.isDown) my += 1;

    // Normalize diagonal movement
    if (mx !== 0 && my !== 0) {
      const inv = 1 / Math.SQRT2;
      mx *= inv;
      my *= inv;
    }
    state.moveX = mx;
    state.moveY = my;

    // Map keyboard to button names
    state.held['A'] = this.keys.action?.isDown ?? false;
    state.justPressed['A'] = this.keys.action?.isDown && !this.keys.action.getDuration() ? true : false;
    state.held['B'] = this.keys.cancel?.isDown ?? false;
    state.held['START'] = this.keys.confirm?.isDown ?? false;
    state.justPressed['START'] = Phaser.Input.Keyboard.JustDown(this.keys.confirm ?? this.keys.action);
  }

  private applyDeadZone(value: number): number {
    if (Math.abs(value) < GAMEPAD.DEAD_ZONE) return 0;
    // Remap from [deadzone, 1] to [0, 1] for smoother response
    const sign = Math.sign(value);
    const magnitude = Math.abs(value);
    return sign * ((magnitude - GAMEPAD.DEAD_ZONE) / (1 - GAMEPAD.DEAD_ZONE));
  }
}
