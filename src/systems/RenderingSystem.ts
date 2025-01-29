import { TransformComponent } from '../components/TransformComponent';
import { Scene } from '../core/Scene';
import { Vector2D } from '../math/Vector2D';
import { System } from './System.abstract';

export class RenderingSystem extends System {
    readonly needsFixedUpdate = false;

    private spriteCache: Map<string, HTMLImageElement> = new Map();

    constructor(
        private canvas: HTMLCanvasElement,
        private context: CanvasRenderingContext2D,
    ) {
        super();
    }

    /** Load a sprite into the cache for faster rendering. */
    async loadSprite(key: string, imagePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.spriteCache.set(key, img);
                resolve();
            };
            img.onerror = () => reject(new Error(`Failed to load sprite: ${imagePath}`));
            img.src = imagePath;
        });
    }

    /** Draw a sprite at the given position with optional rotation and scale. */
    drawSprite(key: string, position: Vector2D, rotation: number = 0, scale: Vector2D = new Vector2D(1, 1)): void {
        const sprite = this.spriteCache.get(key);

        if (!sprite) return;

        this.context.save();
        this.context.translate(position.x, position.y);
        this.context.rotate(rotation);
        this.context.scale(scale.x, scale.y);
        this.context.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
        this.context.restore();
    }

    drawLineToPosition(transform: TransformComponent) {
        this.context.beginPath();
        this.context.moveTo(0, 0);
        this.context.lineTo(transform.getPosition().x, transform.getPosition().y);
        this.context.strokeStyle = 'red';
        this.context.stroke();
    }

    // Clear the entire canvas
    clear(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update(scene: Scene): void {
        this.clear();

        for (const entity of scene.getAllEntities()) {
            const transform = entity.getComponent(TransformComponent);

            if (transform) this.drawLineToPosition(transform);
        }
    }
}
