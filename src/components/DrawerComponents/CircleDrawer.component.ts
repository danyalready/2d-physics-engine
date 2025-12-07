import { Transform } from '../Transform.component';
import { Drawer } from './Drawer.component';

interface CircleDrawerProps {
    radius: number;
    strokeColor?: string;
    fillColor?: string;
}

export class CircleDrawer extends Drawer {
    constructor(private options: CircleDrawerProps) {
        super();
    }

    draw(canvasCtx: CanvasRenderingContext2D, transform: Transform): void {
        const { x, y } = transform.getPosition();

        canvasCtx.beginPath();
        canvasCtx.arc(x, y, this.options.radius, 0, Math.PI * 2, false);

        if (this.options.fillColor) {
            canvasCtx.fillStyle = this.options.fillColor;
            canvasCtx.fill();
        }

        if (this.options.strokeColor) {
            canvasCtx.strokeStyle = this.options.strokeColor;
            canvasCtx.stroke();
        }
    }
}
