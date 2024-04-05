import { Circle } from '../../classes';
import Body, { type BodyParams } from '../../classes/Body/Body';
import Vector from '../../classes/Vector/Vector';
import { BodyLike } from '../../constants';
import { CircleParams } from '../../shapes/Circle/Circle';
import { drawCircle } from '../../utils';

export type BallParams = BodyParams & CircleParams;

class Ball extends Body implements BodyLike {
    public components: [Circle];

    constructor(params: BallParams) {
        super(params);

        this.components = [new Circle(params)];
    }

    static resolveCollision(ballA: Ball, ballB: Ball) {
        const elasticity = (ballA.elasticity + ballB.elasticity) / 2;
        const unitNormal = ballA.position.subtr(ballB.position).unit;
        const unitTangent = unitNormal.normal.unit;

        const v1Normal = Vector.getDot(unitNormal, ballA.linVelocity);
        const v2Normal = Vector.getDot(unitNormal, ballB.linVelocity);

        const v1Tangent = Vector.getDot(unitTangent, ballA.linVelocity);
        const v2Tangent = Vector.getDot(unitTangent, ballB.linVelocity);

        const totalMntm = ballA.mass * v1Normal + ballB.mass * v2Normal;
        const totalMass = ballA.mass + ballB.mass;

        const v1NormalAfter = (elasticity * ballB.mass * (v2Normal - v1Normal) + totalMntm) / totalMass;
        const v2NormalAfter = (elasticity * ballA.mass * (v1Normal - v2Normal) + totalMntm) / totalMass;

        const v1NormalVectorAfter = unitNormal.mult(v1NormalAfter);
        const v2NormalVectorAfter = unitNormal.mult(v2NormalAfter);

        const v1TangentVectorAfter = unitTangent.mult(v1Tangent);
        const v2TangentVectorAfter = unitTangent.mult(v2Tangent);

        ballA.linVelocity = v1NormalVectorAfter.add(v1TangentVectorAfter);
        ballB.linVelocity = v2NormalVectorAfter.add(v2TangentVectorAfter);
    }

    public displayVectors(ctx: CanvasRenderingContext2D) {
        this.linAcceleration.unit.draw(ctx, {
            coordinate: this.position,
            n: this.radius,
            color: 'green',
        });
        this.linVelocity.draw(ctx, {
            coordinate: this.position,
            n: this.radius / 3,
            color: 'red',
        });
    }

    public displayFixedVectors(ctx: CanvasRenderingContext2D) {
        const INDICATOR_OFFSET = 150;
        const INDICATOR_OFFSET_X = ctx.canvas.offsetWidth - INDICATOR_OFFSET;
        const INDICATOR_OFFSET_Y = ctx.canvas.offsetHeight - INDICATOR_OFFSET;

        drawCircle(ctx, {
            coordinate: { x: INDICATOR_OFFSET_X, y: INDICATOR_OFFSET_Y },
            radius: this.radius,
        });

        this.linVelocity.draw(ctx, {
            coordinate: { x: INDICATOR_OFFSET_X, y: INDICATOR_OFFSET_Y },
            n: this.radius / 3,
            color: 'red',
        });

        this.linAcceleration.unit.draw(ctx, {
            coordinate: { x: INDICATOR_OFFSET_X, y: INDICATOR_OFFSET_Y },
            n: this.radius,
            color: 'green',
        });

        this.linAcceleration.normal.draw(ctx, {
            coordinate: { x: INDICATOR_OFFSET_X, y: INDICATOR_OFFSET_Y },
            n: this.radius,
            color: 'yellow',
        });
    }

    public reposition(): void {
        super.reposition();

        this.components[0].position = this.position;
    }

    public get radius(): number {
        return this.components[0].radius;
    }

    public get color(): string {
        return this.components[0].color;
    }

    public get isFill(): boolean {
        return this.components[0].isFill;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.components.forEach((component) => component.draw(ctx));
    }
}

export default Ball;
