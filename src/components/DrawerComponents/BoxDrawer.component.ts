import { Transform } from '../Transform.component';
import { Drawer } from './Drawer.component';

export class BoxDrawer extends Drawer {
    constructor(
        private width: number,
        private height: number,
    ) {
        super();
    }

    draw(canvasCtx: CanvasRenderingContext2D, transform: Transform): void {
        const { x, y } = transform.getPosition();
        const rotation = transform.getRotation();

        canvasCtx.save();

        // Translate to center of box
        canvasCtx.translate(x, y);
        canvasCtx.rotate(rotation);

        // Draw rectangle centered at origin
        canvasCtx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

        canvasCtx.restore();
    }
}
