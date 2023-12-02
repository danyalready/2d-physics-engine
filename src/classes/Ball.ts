import Vector, { type Coordinate } from './Vector';
import { drawCircle } from '../utils';

export type Circle = {
    coordinate: Coordinate;
    radius: number;
    color?: CSSStyleDeclaration['color'];
    isFill?: boolean;
};

type BallParams = Circle & {
    accelerationUnit: number;
    isPlayer?: boolean;
};

class Ball {
    public radius: number;
    public color: CSSStyleDeclaration['color'];
    public position: Vector;
    public velocity: Vector;
    public acceleration: Vector;
    public accelerationUnit: number;
    public isPlayer: boolean;

    constructor(params: BallParams) {
        this.radius = params.radius;
        this.color = params.color || 'black';
        this.position = new Vector({
            x: params.coordinate.x,
            y: params.coordinate.y,
        });
        this.velocity = new Vector({ x: 0, y: 0 });
        this.acceleration = new Vector({ x: 0, y: 0 });
        this.accelerationUnit = params.accelerationUnit;
        this.isPlayer = !!params.isPlayer;
    }

    static isCollision(ball1: Ball, ball2: Ball, distance: number) {
        return ball1.radius + ball2.radius >= distance;
    }

    static resolvePenetration(ball1: Ball, ball2: Ball) {
        const distanceVector = ball1.position.subtr(ball2.position);
        const penetrationDepth = ball1.radius + ball2.radius - distanceVector.magnitude;
        const repulseVector = distanceVector.unit.mult(penetrationDepth / 2);

        ball1.position = ball1.position.add(repulseVector);
        ball2.position = ball2.position.add(repulseVector.mult(-1));
    }

    public displayVectors(ctx: CanvasRenderingContext2D) {
        this.acceleration.unit.draw(ctx, {
            coordinate: {
                x: this.position.x,
                y: this.position.y,
            },
            n: this.radius,
            color: 'green',
        });
        this.velocity.draw(ctx, {
            coordinate: {
                x: this.position.x,
                y: this.position.y,
            },
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
            coordinate: {
                x: INDICATOR_OFFSET_X,
                y: INDICATOR_OFFSET_Y,
            },
            n: this.radius / 3,
            color: 'red',
        });

        this.acceleration.unit.draw(ctx, {
            coordinate: {
                x: INDICATOR_OFFSET_X,
                y: INDICATOR_OFFSET_Y,
            },
            n: this.radius,
            color: 'green',
        });

        this.acceleration.normal.draw(ctx, {
            coordinate: {
                x: INDICATOR_OFFSET_X,
                y: INDICATOR_OFFSET_Y,
            },
            n: this.radius,
            color: 'yellow',
        });
    }

    public draw(ctx: CanvasRenderingContext2D) {
        drawCircle(ctx, {
            coordinate: { x: this.position.x, y: this.position.y },
            radius: this.radius,
            color: this.color,
            isFill: true,
        });
    }
}

export default Ball;
