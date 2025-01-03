import { GameObject } from './GameObject';

export class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private rootObject: GameObject;
    private lastFrameTime: number = 0;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d')!;
        this.rootObject = new GameObject();

        this.gameLoop = this.gameLoop.bind(this);
    }

    addObject(object: GameObject): void {
        this.rootObject.addChild(object);
    }

    start(): void {
        this.lastFrameTime = performance.now();
        requestAnimationFrame(this.gameLoop);
    }

    private gameLoop(currentTime: number): void {
        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;

        // Clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and render game objects
        this.rootObject.update(deltaTime);
        this.rootObject.render(this.context);

        requestAnimationFrame(this.gameLoop);
    }
}
