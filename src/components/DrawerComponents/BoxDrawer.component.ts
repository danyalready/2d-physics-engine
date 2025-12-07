import { Transform } from '../Transform.component';
import { Drawer } from './Drawer.component';

interface BoxDrawerProps {
    size: { width: number; height: number };
    strokeColor?: string;
    fillColor?: string;
}

export class BoxDrawer extends Drawer {
    constructor(private options: BoxDrawerProps) {
        super();
    }

    draw(canvasCtx: CanvasRenderingContext2D, transform: Transform): void {
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
