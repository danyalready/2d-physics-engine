import { Vector2D } from '../math/Vector2D';

type KeyState = {
    isPressed: boolean;
    wasPressed: boolean;
};

export class InputManager {
    private keyStates: Map<string, KeyState>;
    private mousePosition: Vector2D;
    private mouseButtons: Map<number, KeyState>;

    constructor() {
        this.keyStates = new Map();
        this.mousePosition = new Vector2D();
        this.mouseButtons = new Map();

        // Set up event listeners
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('mousedown', this.handleMouseDown.bind(this));
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    update(): void {
        // Update wasPressed states
        this.keyStates.forEach((state) => {
            state.wasPressed = state.isPressed;
        });
        this.mouseButtons.forEach((state) => {
            state.wasPressed = state.isPressed;
        });
    }

    isKeyPressed(key: string): boolean {
        return this.keyStates.get(key)?.isPressed || false;
    }

    isKeyJustPressed(key: string): boolean {
        const state = this.keyStates.get(key);
        return state ? state.isPressed && !state.wasPressed : false;
    }

    getMousePosition(): Vector2D {
        return this.mousePosition;
    }

    isMouseButtonPressed(button: number): boolean {
        return this.mouseButtons.get(button)?.isPressed || false;
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
