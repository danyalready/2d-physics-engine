import { Transform } from '../Transform.component';
import { Drawer } from './Drawer.component';

export class CircleDrawer extends Drawer {
    constructor(private radius: number) {
        super();
    }

    draw(canvasCtx: CanvasRenderingContext2D, transform: Transform): void {
        const { x, y } = transform.getPosition();

        canvasCtx.beginPath();
        canvasCtx.arc(x, y, this.radius, 0, Math.PI * 2, false);
        canvasCtx.stroke();
    }
}
