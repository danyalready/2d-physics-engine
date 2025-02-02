import { Physics } from '../systems/Physics.system';
import { Rendering } from '../systems/Rendering.system';
import { System } from '../systems/System.abstract';
import { InputManager } from './InputManager';
import { Scene } from './Scene';

interface EngineConfig {
    fixedTimeStep?: number;
    maxDeltaTime?: number;
    debug?: boolean;
}

export class Engine {
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
        canvas: HTMLCanvasElement,
        canvasCtx: CanvasRenderingContext2D,
        config?: EngineConfig,
    ) {
        if (!canvas || !canvasCtx) {
            throw new Error('Canvas and canvas-context are required for engine initialization.');
        }

        this.fixedTimeStep = config?.fixedTimeStep ?? this.fixedTimeStep;
        this.maxDeltaTime = config?.maxDeltaTime ?? this.maxDeltaTime;
        this.debug = config?.debug ?? this.debug;

        // Initialize systems
        this.systems.push(new Rendering(canvas, canvasCtx), new Physics());

        this.loop = this.loop.bind(this);
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

        // Clamps the delta time to maxDeltaTime to prevent large jumps if the game lags
        const deltaTime = Math.min((currentTime - this.lastFrameTime) / 1000, this.maxDeltaTime);
        this.lastFrameTime = currentTime;

        if (this.debug) {
            this.logDebugInfo(deltaTime);
        }

        // Fixed timestep updates for physics
        this.accumulator += deltaTime;
        while (this.accumulator >= this.fixedTimeStep) {
            this.fixedUpdate(this.fixedTimeStep);
            this.accumulator -= this.fixedTimeStep;
        }

        // Variable timestep updates for everything else
        this.update(deltaTime);

        requestAnimationFrame(this.loop);
    }

    private logDebugInfo(deltaTime: number): void {
        // TODO: print log info on canvas instead of console
        console.log({
            fps: Math.round(1 / deltaTime),
            deltaTime: deltaTime.toFixed(4),
            entities: this.scene?.getEntities().length ?? 0,
            accumulator: this.accumulator.toFixed(4),
        });
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
