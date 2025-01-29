import { Physics } from '../systems/Physics.system';
import { Rendering } from '../systems/Rendering.system';
import { System } from '../systems/System.abstract';
import { InputManager } from './InputManager';
import { Scene } from './Scene';

export class Engine {
    private readonly fixedTimeStep: number = 1 / 60; // 60 FPS physics
    private readonly systems: System[] = [];

    private scene: Scene | null = null;
    private lastFrameTime: number = 0;
    private isRunning: boolean = false;
    private accumulator: number = 0;

    constructor(
        private readonly inputManager: InputManager,
        canvas: HTMLCanvasElement,
        canvasCtx: CanvasRenderingContext2D,
    ) {
        this.loop = this.loop.bind(this);

        // Initialize systems
        this.systems.push(new Rendering(canvas, canvasCtx), new Physics());
    }

    setScene(scene: Scene): void {
        if (this.scene) {
            this.scene.onUnload();
        }

        this.scene = scene;

        scene.onLoad();
    }

    start(): void {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastFrameTime = performance.now();
            this.accumulator = 0;

            requestAnimationFrame(this.loop);
        }
    }

    stop(): void {
        this.isRunning = false;
    }

    private loop(currentTime: number): void {
        if (!this.isRunning) return;

        const deltaTime = Math.min((currentTime - this.lastFrameTime) / 1000, 0.1);
        this.lastFrameTime = currentTime;

        this.accumulator += deltaTime;

        // Fixed timestep updates for physics
        while (this.accumulator >= this.fixedTimeStep) {
            this.fixedUpdate(this.fixedTimeStep);
            this.accumulator -= this.fixedTimeStep;
        }

        // Variable timestep updates for everything else
        this.update(deltaTime);

        requestAnimationFrame(this.loop);
    }

    private fixedUpdate(fixedDeltaTime: number): void {
        if (this.scene) {
            for (const system of this.systems) {
                if (system.needsFixedUpdate) {
                    system.update(this.scene, fixedDeltaTime);
                }
            }
        }
    }

    private update(deltaTime: number): void {
        this.inputManager.update();

        if (this.scene) {
            // Update systems that don't need fixed timestep
            for (const system of this.systems) {
                if (!system.needsFixedUpdate) {
                    system.update(this.scene, deltaTime);
                }
            }

            this.scene.update(deltaTime);
        }
    }
}
