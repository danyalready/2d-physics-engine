import { Vector2 } from '../math/Vector2';

interface KeyState {
    isPressed: boolean;
    wasPressed: boolean;
}

export class InputManager {
    private keyStates: Map<string, KeyState> = new Map();
    private mousePosition: Vector2 = new Vector2();
    private mouseButtons: Map<number, KeyState> = new Map();

    constructor() {
        // Set up event listeners
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('mousedown', this.handleMouseDown.bind(this));
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    update(): void {
        // Update wasPressed states
        this.keyStates.forEach((state) => (state.wasPressed = state.isPressed));
        this.mouseButtons.forEach((state) => (state.wasPressed = state.isPressed));
    }

    isKeyPressed(key: string): boolean {
        return this.keyStates.get(key)?.isPressed || false;
    }

    isKeyJustPressed(key: string): boolean {
        const state = this.keyStates.get(key);

        return state ? state.isPressed && !state.wasPressed : false;
    }

    isMouseButtonPressed(button: number): boolean {
        return this.mouseButtons.get(button)?.isPressed || false;
    }

    isMouseButtonJustPressed(button: number): boolean {
        return this.mouseButtons.get(button)?.wasPressed || false;
    }

    getMousePosition(): Vector2 {
        return this.mousePosition;
    }

    private handleKeyDown(event: KeyboardEvent): void {
        this.keyStates.set(event.key, { isPressed: true, wasPressed: false });
    }

    private handleKeyUp(event: KeyboardEvent): void {
        this.keyStates.set(event.key, { isPressed: false, wasPressed: true });
    }

    private handleMouseMove(event: MouseEvent): void {
        this.mousePosition = new Vector2(event.clientX, event.clientY);
    }

    private handleMouseDown(event: MouseEvent): void {
        this.mouseButtons.set(event.button, { isPressed: true, wasPressed: false });
    }

    private handleMouseUp(event: MouseEvent): void {
        this.mouseButtons.set(event.button, { isPressed: false, wasPressed: true });
    }
}
