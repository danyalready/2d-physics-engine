import { Circle, Matrix, Vector } from '../../classes';
import type { BodyParams } from '../Body/Body';
import { BodyLike } from '../../constants';
import type { CircleParams } from '../../shapes/Circle/Circle';
import Body from '../Body/Body';

type CapsuleParams = BodyParams &
    CircleParams & {
        length: number;
    };

class Capsule extends Body implements BodyLike {
    /** The distance between the components of Capsule. */
    public length: number;

    /** The center point of Capsule. */
    public position: Vector;

    public components: [Circle, Circle];

    /** The initial position of the first component of Capsule. */
    private readonly refPositionStart: Vector;

    /** The initial position of the second component of Capsule. */
    private readonly refPositionEnd: Vector;

    constructor(params: CapsuleParams) {
        super(params);

        this.length = params.length;
        this.position = params.position;
        this.components = [
            new Circle({
                position: this.position.subtr(new Vector({ x: this.position.x + this.length / 2, y: 0 })),
                radius: params.radius,
                color: params.color,
            }),
            new Circle({
                position: this.position.subtr(new Vector({ x: this.position.x - this.length / 2, y: 0 })),
                radius: params.radius,
                color: params.color,
            }),
        ];
        this.refPositionStart = this.components[0].position;
        this.refPositionEnd = this.components[1].position;
    }

    public get unit(): Vector {
        return this.components[1].position.subtr(this.components[0].position).unit;
    }

    private get refUnit(): Vector {
        return this.refPositionEnd.subtr(this.refPositionStart).unit;
    }

    public reposition(): void {
        super.reposition();

        this.angle += this.angVelocity;

        const capsuleRotationMatrix = Matrix.getRotationMatrix(this.angle);
        const capsuleUnitMatrix = new Matrix(2, 1);

        capsuleUnitMatrix.data = [[this.refUnit.x], [this.refUnit.y]];

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
            this.angle + Math.PI / 2,
            this.angle + Math.PI * 1.5,
        );
        ctx.arc(
            this.components[1].position.x,
            this.components[1].position.y,
            this.components[1].radius,
            this.angle + Math.PI * 1.5,
            this.angle + Math.PI / 2,
        );
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    public get radius() {
        return this.components[0].radius;
    }

    public get color() {
        return this.components[0].color;
    }
}

export default Capsule;
