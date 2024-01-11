import PhysicalObject, { type PhysicalObjectParams } from './PhysicalObject';
import Vector from './Vector';

type CapsuleParams = PhysicalObjectParams & {
    radius: number;
    length: number;
};

class Capsule extends PhysicalObject {
    public radius: number;
    public length: number;
    public positionStart: Vector;
    public positionEnd: Vector;
    public readonly refPositionStart: Vector;
    public readonly refPositionEnd: Vector;

    constructor(params: CapsuleParams) {
        super(params);

        this.radius = params.radius;
        this.length = params.length;
        this.positionStart = new Vector({ x: this.position.x - params.length / 2, y: this.position.y });
        this.positionEnd = new Vector({ x: this.position.x + params.length / 2, y: this.position.y });

        this.refPositionStart = new Vector({ ...this.positionStart });
        this.refPositionEnd = new Vector({ ...this.positionEnd });
    }

    public get center(): Vector {
        return this.refPositionStart.add(this.refPositionEnd).mult(0.5);
    }

    public get unit(): Vector {
        return this.refPositionEnd.subtr(this.refPositionStart).unit;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        // POSITION START ARC
        ctx.beginPath();
        ctx.arc(
            this.positionStart.x,
            this.positionStart.y,
            this.radius,
            this.angle + Math.PI / 2,
            this.angle + Math.PI * 1.5,
        );
        ctx.arc(
            this.positionEnd.x,
            this.positionEnd.y,
            this.radius,
            this.angle + Math.PI * 1.5,
            this.angle + Math.PI / 2,
        );
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
}

export default Capsule;
