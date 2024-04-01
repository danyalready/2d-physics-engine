import Circle, { type CircleParams } from '../Circle/Circle';
import Vector from '../../classes/Vector/Vector';
import Matrix from '../../classes/Matrix/Matrix';

type CapsuleParams = CircleParams & {
    length: number;
};

class Capsule extends Circle {
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

    public get unit(): Vector {
        return this.refPositionEnd.subtr(this.refPositionStart).unit;
    }

    public repositionate(): void {
        super.repositionate();

        const capsuleRotationMatrix = Matrix.getRotationMatrix(this.angle);
        const capsuleUnitMatrix = new Matrix(2, 1);

        capsuleUnitMatrix.data = [[this.unit.x], [this.unit.y]];

        const capsuleRotatedUnitMatrix = capsuleRotationMatrix.mult(capsuleUnitMatrix);
        const capsuleRotatedUnit = new Vector({
            x: capsuleRotatedUnitMatrix.data[0][0],
            y: capsuleRotatedUnitMatrix.data[1][0],
        });

        this.positionStart = this.position.add(capsuleRotatedUnit.mult(-this.length / 2));
        this.positionEnd = this.position.add(capsuleRotatedUnit.mult(this.length / 2));
    }

    public getClosestPointTo(vector: Vector): Vector {
        const vectorToPositionStart = this.positionStart.subtr(vector);
        const positionEndToVector = vector.subtr(this.positionEnd);

        if (Vector.getDot(this.unit, vectorToPositionStart) > 0) {
            return this.positionStart;
        }

        if (Vector.getDot(this.unit, positionEndToVector) > 0) {
            return this.positionEnd;
        }

        const scalar = Vector.getDot(this.unit, vectorToPositionStart);
        const closestVector = this.unit.mult(scalar);

        return this.positionStart.subtr(closestVector);
    }

    public draw(ctx: CanvasRenderingContext2D) {
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
