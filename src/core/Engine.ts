import { Scene } from './Scene';

export class Engine {
    private scene: Scene | null;
    private lastFrameTime: number;
    private isRunning: boolean;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

        if (!canvas) {
            throw new Error(`Canvas with id ${canvasId} not found`);
        }

        this.canvas = canvas;

        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Could not get 2D context');
        }

        this.context = context;
        this.scene = null;
        this.lastFrameTime = 0;
        this.isRunning = false;

        // Bind the gameLoop method to this instance
        this.gameLoop = this.gameLoop.bind(this);
    }

    setScene(scene: Scene): void {
        this.scene = scene;
    }

    start(): void {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastFrameTime = performance.now();
            requestAnimationFrame(this.gameLoop);
        }
    }

    stop(): void {
        this.isRunning = false;
    }

    private gameLoop(currentTime: number): void {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
        this.lastFrameTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.gameLoop);
    }

    private update(deltaTime: number): void {
        if (this.scene) {
            this.scene.update(deltaTime);
        }
    }

    private render(): void {
        // Clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Add rendering logic here
        if (this.scene) {
            // Implement rendering of scene entities
        }
    }
}
