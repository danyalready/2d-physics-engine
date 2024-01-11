import PhysicalObject, { type PhysicalObjectParams } from './PhysicalObject';
import Vector from './Vector';

type CapsuleParams = PhysicalObjectParams & {
    radius: number;
    length: number;
};

class Capsule extends PhysicalObject {
    public radius: number;
    public positionEnd: Vector;
    public refPositionStart: Vector;
    public refPositionEnd: Vector;

    constructor(params: CapsuleParams) {
        super(params);

        this.radius = params.radius;
        this.positionEnd = new Vector({ x: this.positionStart.x + params.length, y: this.positionStart.y });
        this.refPositionStart = this.positionStart;
        this.refPositionEnd = this.positionEnd;
    }

    public get positionStart(): Vector {
        return this.position;
    }

    public set positionStart(vector: Vector) {
        this.position = vector;
    }

    public get positionCenter(): Vector {
        return this.refPositionStart.add(this.refPositionEnd).mult(0.5);
    }

    public get unit(): Vector {
        return this.refPositionEnd.subtr(this.refPositionStart).unit;
    }

    public get length(): number {
        return this.refPositionStart.subtr(this.refPositionEnd).magnitude;
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
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();

        // POSITION END ARC
        ctx.beginPath();
        ctx.arc(
            this.positionEnd.x,
            this.positionEnd.y,
            this.radius,
            this.angle + Math.PI / 2,
            this.angle + Math.PI * 1.5,
            true,
        );
        ctx.strokeStyle = 'red';
        ctx.stroke();
        ctx.closePath();
    }
}

export default Capsule;
