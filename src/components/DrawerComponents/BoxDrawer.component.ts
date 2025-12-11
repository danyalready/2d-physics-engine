import { Transform } from '../Transform.component';
import { Drawer } from './Drawer.component';

interface BoxDrawerProps {
    size: { width: number; height: number };
    strokeColor?: string;
    fillColor?: string;
}

export class BoxDrawer extends Drawer {
    constructor(public options: BoxDrawerProps) {
        super();
    }

    draw(canvasCtx: CanvasRenderingContext2D): void {
        const transform = this.parent.getComponent(Transform);

        if (!transform) {
            throw new Error('Parent entity does not have Transform component.');
        }

        const { x, y } = transform.getPosition();
        const rotation = transform.getRotation();

        canvasCtx.save();

        // Translate to center of box
        canvasCtx.translate(x, y);
        canvasCtx.rotate(rotation);

        // Fill box if fillColor is provided
        if (this.options.fillColor) {
            canvasCtx.fillStyle = this.options.fillColor;
            canvasCtx.fillRect(
                -this.options.size.width / 2,
                -this.options.size.height / 2,
                this.options.size.width,
                this.options.size.height,
            );
        }

        // Stroke box
        if (this.options.strokeColor) {
            canvasCtx.strokeStyle = this.options.strokeColor;
            canvasCtx.strokeRect(
                -this.options.size.width / 2,
                -this.options.size.height / 2,
                this.options.size.width,
                this.options.size.height,
            );
        }

        canvasCtx.restore();
    }
}
