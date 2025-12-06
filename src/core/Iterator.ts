import { AABB } from '../math/AABB';
import { Vector2 } from '../math/Vector2';
import { Physics } from '../systems/PhysicsSystem/Physics.system';
import { Rendering } from '../systems/Rendering.system';
import { System } from '../systems/System.abstract';
import { InputManager } from './InputManager';
import { Scene } from './Scene';

interface IteratorConfig {
    fixedTimeStep?: number;
    maxDeltaTime?: number;
    debug?: boolean;
}

export class Iterator {
    private readonly fixedTimeStep: number = 1 / 60; // 60 FPS physics
    private readonly maxDeltaTime: number = 0.1;
    private readonly debug: boolean = false;

    private systems: System[] = [];
    private scene: Scene | null = null;
    private lastFrameTime: number = 0;
    private isRunning: boolean = false;
    private accumulator: number = 0;

    constructor(
        private readonly inputManager: InputManager,
        private readonly canvas: HTMLCanvasElement,
        private readonly canvasCtx: CanvasRenderingContext2D,
        config?: IteratorConfig,
    ) {
        if (!this.canvas || !this.canvasCtx) {
            throw new Error('Canvas and canvas-context are required for engine initialization.');
        }

        this.fixedTimeStep = config?.fixedTimeStep ?? this.fixedTimeStep;
        this.maxDeltaTime = config?.maxDeltaTime ?? this.maxDeltaTime;
        this.debug = config?.debug ?? this.debug;

        // Initialize systems
        this.systems.push(
            new Rendering(this.canvas, this.canvasCtx),
            new Physics(new AABB(new Vector2(0, 0), new Vector2(this.canvas.width, this.canvas.height))),
        );

        this.loop = this.loop.bind(this);
    }

    setScene(scene: Scene): void {
        if (this.scene) {
            this.scene.onUnload();
        }

        this.scene = scene;

        scene.onLoad();
    }

    addSystem(system: System) {
        this.systems.push(system);
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

        // Clamps the delta time to maxDeltaTime in seconds to prevent large jumps if the game lags
        const deltaTime = Math.min((currentTime - this.lastFrameTime) / 1000, this.maxDeltaTime);
        this.lastFrameTime = currentTime;

        // Fixed timestep updates for physics
        this.accumulator += deltaTime;
        while (this.accumulator >= this.fixedTimeStep) {
            this.fixedUpdate(this.fixedTimeStep);
            this.accumulator -= this.fixedTimeStep;
        }

        // Variable timestep updates for everything else
        this.update(deltaTime);

        if (this.debug) {
            this.logDebugInfo(deltaTime);
        }

        requestAnimationFrame(this.loop);
    }

    private logDebugInfo(deltaTime: number): void {
        const fps = Math.round(1 / deltaTime);
        const entities = this.scene?.getEntities().length ?? 0;

        // ---- Clear previous debug text area ----
        this.canvasCtx.save();
        this.canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        this.canvasCtx.fillRect(0, 0, 160, 70);

        // ---- Draw text ----
        this.canvasCtx.fillStyle = 'white';
        this.canvasCtx.font = '14px monospace';

        this.canvasCtx.fillText(`FPS: ${fps}`, 10, 20);
        this.canvasCtx.fillText(`Delta: ${deltaTime.toFixed(4)}`, 10, 35);
        this.canvasCtx.fillText(`Entities: ${entities}`, 10, 50);
        this.canvasCtx.fillText(`Acc: ${this.accumulator.toFixed(4)}`, 10, 65);

        this.canvasCtx.restore();
    }

    private fixedUpdate(fixedDeltaTime: number): void {
        if (this.scene) {
            for (const system of this.systems) {
                if (system.needsFixedUpdate) {
                    system.update(fixedDeltaTime, this.scene);
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
                    system.update(deltaTime, this.scene);
                }
            }

            this.scene.update(deltaTime);
        }
    }
}
