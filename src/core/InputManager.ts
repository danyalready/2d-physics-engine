import { Vector2D } from '../math/Vector2D';

interface KeyState {
    isPressed: boolean;
    wasPressed: boolean;
}

export class InputManager {
    private keyStates: Map<string, KeyState> = new Map();
    private mousePosition: Vector2D = new Vector2D();
    private mouseButtons: Map<number, KeyState> = new Map();

    constructor() {
        // Set up event listeners
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('mousedown', this.handleMouseDown.bind(this));
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    public update(): void {
        // Update wasPressed states
        this.keyStates.forEach((state) => (state.wasPressed = state.isPressed));
        this.mouseButtons.forEach((state) => (state.wasPressed = state.isPressed));
    }

    public isKeyPressed(key: string): boolean {
        return this.keyStates.get(key)?.isPressed || false;
    }

    public isKeyJustPressed(key: string): boolean {
        const state = this.keyStates.get(key);

        return state ? state.isPressed && !state.wasPressed : false;
    }

    public isMouseButtonPressed(button: number): boolean {
        return this.mouseButtons.get(button)?.isPressed || false;
    }

    public isMouseButtonJustPressed(button: number): boolean {
        return this.mouseButtons.get(button)?.wasPressed || false;
    }

    public getMousePosition(): Vector2D {
        return this.mousePosition;
    }

    private handleKeyDown(event: KeyboardEvent): void {
        this.keyStates.set(event.key, { isPressed: true, wasPressed: false });
    }

    private handleKeyUp(event: KeyboardEvent): void {
        this.keyStates.set(event.key, { isPressed: false, wasPressed: true });
    }

    private handleMouseMove(event: MouseEvent): void {
        this.mousePosition = new Vector2D(event.clientX, event.clientY);
    }

    private handleMouseDown(event: MouseEvent): void {
        this.mouseButtons.set(event.button, { isPressed: true, wasPressed: false });
    }

    private handleMouseUp(event: MouseEvent): void {
        this.mouseButtons.set(event.button, { isPressed: false, wasPressed: true });
    }
}
