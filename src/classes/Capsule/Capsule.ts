import { Circle, Matrix, Vector } from '..';

type CapsuleParams = {
    length: number;
    position: Vector;
    radius?: number;
    components?: [Circle, Circle];
};

class Capsule {
    /** The distance between the components of Capsule. */
    public length: number;

    /** The center point of Capsule. */
    public position: Vector;

    public components: [Circle, Circle];

    /** The initial position of the first component of Capsule. */
    public readonly refPositionStart: Vector;

    /** The initial position of the second component of Capsule. */
    public readonly refPositionEnd: Vector;

    constructor(params: CapsuleParams) {
        this.length = params.length;
        this.position = params.position;
        this.components = params.components || [
            new Circle({
                coordinate: this.position.subtr(new Vector({ x: this.position.x - this.length / 2, y: 0 })),
                radius: params.radius || 10,
            }),
            new Circle({
                coordinate: this.position.subtr(new Vector({ x: this.position.x + this.length / 2, y: 0 })),
                radius: params.radius || 10,
            }),
        ];

        this.refPositionStart = this.components[0].position;
        this.refPositionEnd = this.components[1].position;
    }

    public get unit(): Vector {
        return this.refPositionEnd.subtr(this.refPositionStart).unit;
    }

    public reposition(): void {
        const capsuleRotationMatrix = Matrix.getRotationMatrix(0); // TODO: this.angle
        const capsuleUnitMatrix = new Matrix(2, 1);

        capsuleUnitMatrix.data = [[this.unit.x], [this.unit.y]];

        const capsuleRotatedUnitMatrix = capsuleRotationMatrix.mult(capsuleUnitMatrix);
        const capsuleRotatedUnit = new Vector({
            x: capsuleRotatedUnitMatrix.data[0][0],
            y: capsuleRotatedUnitMatrix.data[1][0],
        });

        this.components[0].position = this.position.add(capsuleRotatedUnit.mult(-this.length / 2));
        this.components[1].position = this.position.add(capsuleRotatedUnit.mult(this.length / 2));
    }

    /** Returns the closest point of Capsule to the given vector. */
    public getClosestPointTo(vector: Vector): Vector {
        const vectorToPositionStart = this.components[0].position.subtr(vector);
        const positionEndToVector = vector.subtr(this.components[1].position);

        if (Vector.getDot(this.unit, vectorToPositionStart) > 0) {
            return this.components[0].position;
        }

        if (Vector.getDot(this.unit, positionEndToVector) > 0) {
            return this.components[1].position;
        }

        const scalar = Vector.getDot(this.unit, vectorToPositionStart);
        const closestVector = this.unit.mult(scalar);

        return this.components[0].position.subtr(closestVector);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(
            this.components[0].position.x,
            this.components[0].position.y,
            this.components[0].radius,
            0 + Math.PI / 2, // TODO: this.angle
            0 + Math.PI * 1.5, // TODO: this.angle
        );
        ctx.arc(
            this.components[1].position.x,
            this.components[1].position.y,
            0, // TODO: this.angle
            0 + Math.PI * 1.5, // TODO: this.angle
            0 + Math.PI / 2, // TODO: this.angle
        );
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
}

export default Capsule;
