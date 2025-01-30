import { Drawer } from '../components/DrawerComponents/Drawer.component';
import { Transform } from '../components/Transform.component';
import { Scene } from '../core/Scene';
import { Vector2D } from '../math/Vector2D';
import { System } from './System.abstract';

export class Rendering extends System {
    readonly needsFixedUpdate = false;

    private spriteCache: Map<string, HTMLImageElement> = new Map();

    constructor(
        private canvas: HTMLCanvasElement,
        private canvasCtx: CanvasRenderingContext2D,
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

        this.canvasCtx.save();
        this.canvasCtx.translate(position.x, position.y);
        this.canvasCtx.rotate(rotation);
        this.canvasCtx.scale(scale.x, scale.y);
        this.canvasCtx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
        this.canvasCtx.restore();
    }

    drawLineToPosition(transform: Transform) {
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(0, 0);
        this.canvasCtx.lineTo(transform.getPosition().x, transform.getPosition().y);
        this.canvasCtx.strokeStyle = 'red';
        this.canvasCtx.stroke();
    }

    // Clear the entire canvas
    clear(): void {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update(scene: Scene): void {
        this.clear();

        for (const entity of scene.getEntities()) {
            const drawer = entity.getComponent(Drawer);
            const transform = entity.getComponent(Transform);

            if (transform && drawer) {
                this.drawLineToPosition(transform);
                drawer.draw(this.canvasCtx, transform);
            }

            // if (shape) shape.draw(this.canvasCtx, entity);
        }
    }
}
