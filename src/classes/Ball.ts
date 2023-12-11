import Vector, { type Coordinate } from './Vector';
import { drawCircle } from '../utils';

const FRICTION: number = 0.095;

export type Circle = {
    coordinate: Coordinate;
    radius: number;
    color?: CSSStyleDeclaration['color'];
    isFill?: boolean;
};

type BallParams = Circle & {
    accelerationUnit: number;
    mass: number;
    isPlayer?: boolean;
};

class Ball {
    public mass: number;
    public radius: number;
    public color: CSSStyleDeclaration['color'];
    public position: Vector;
    public velocity: Vector;
    public acceleration: Vector;
    public accelerationUnit: number;
    public isPlayer: boolean;

    constructor(params: BallParams) {
        this.mass = params.mass;
        this.radius = params.radius;
        this.color = params.color || 'black';
        this.position = new Vector(params.coordinate);
        this.velocity = new Vector({ x: 0, y: 0 });
        this.acceleration = new Vector({ x: 0, y: 0 });
        this.accelerationUnit = params.accelerationUnit;
        this.isPlayer = !!params.isPlayer;
    }

    static isCollision(ball1: Ball, ball2: Ball, distance: number) {
        return ball1.radius + ball2.radius >= distance;
    }

    static resolvePenetration(ball1: Ball, ball2: Ball) {
        const distance = ball1.position.subtr(ball2.position);
        const penetrationDepth = ball1.radius + ball2.radius - distance.magnitude;
        const repulse = distance.unit.mult(penetrationDepth / 2);

        ball1.position = ball1.position.add(repulse);
        ball2.position = ball2.position.add(repulse.mult(-1));
    }

    static resolveCollision(ball1: Ball, ball2: Ball) {
        const unitNormal = ball1.position.subtr(ball2.position).unit;
        const unitTangent = unitNormal.normal.unit;
        const totalMass = ball1.mass + ball2.mass;

        const v1Normal = Vector.getDot(unitNormal, ball1.velocity);
        const v2Normal = Vector.getDot(unitNormal, ball2.velocity);

        const v1Tangent = Vector.getDot(unitTangent, ball1.velocity);
        const v2Tangent = Vector.getDot(unitTangent, ball2.velocity);

        const v1NormalAfter = (v1Normal * (ball1.mass - ball2.mass) + 2 * ball2.mass * v2Normal) / totalMass;
        const v2NormalAfter = (v2Normal * (ball2.mass - ball1.mass) + 2 * ball1.mass * v1Normal) / totalMass;

        const v1NormalVectorAfter = unitNormal.mult(v1NormalAfter);
        const v2NormalVectorAfter = unitNormal.mult(v2NormalAfter);

        const v1TangentVectorAfter = unitTangent.mult(v1Tangent);
        const v2TangentVectorAfter = unitTangent.mult(v2Tangent);

        ball1.velocity = v1NormalVectorAfter.add(v1TangentVectorAfter);
        ball2.velocity = v2NormalVectorAfter.add(v2TangentVectorAfter);
    }

    public repositionate() {
        this.acceleration = this.acceleration.unit.mult(this.accelerationUnit);
        this.velocity = this.velocity.add(this.acceleration);
        this.velocity = this.velocity.mult(1 - FRICTION);
        this.position = this.position.add(this.velocity);
    }

    public displayVectors(ctx: CanvasRenderingContext2D) {
        this.acceleration.unit.draw(ctx, {
            coordinate: this.position,
            n: this.radius,
            color: 'green',
        });
        this.velocity.draw(ctx, {
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

        this.velocity.draw(ctx, {
            coordinate: { x: INDICATOR_OFFSET_X, y: INDICATOR_OFFSET_Y },
            n: this.radius / 3,
            color: 'red',
        });

        this.acceleration.unit.draw(ctx, {
            coordinate: { x: INDICATOR_OFFSET_X, y: INDICATOR_OFFSET_Y },
            n: this.radius,
            color: 'green',
        });

        this.acceleration.normal.draw(ctx, {
            coordinate: { x: INDICATOR_OFFSET_X, y: INDICATOR_OFFSET_Y },
            n: this.radius,
            color: 'yellow',
        });
    }

    public draw(ctx: CanvasRenderingContext2D) {
        drawCircle(ctx, {
            coordinate: this.position,
            radius: this.radius,
            color: this.color,
            isFill: true,
        });
    }
}

export default Ball;
