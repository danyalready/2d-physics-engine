import Body, { type BodyParams } from '../../classes/Body/Body';
import Vector from '../../classes/Vector/Vector';

import { drawCircle } from '../../utils';

export type BallParams = BodyParams & {
    radius: number;
    color?: CSSStyleDeclaration['color'];
    isFill?: boolean;
};

class Ball extends Body {
    public radius: number;
    public color: CSSStyleDeclaration['color'];
    public isFill: boolean;

    constructor(params: BallParams) {
        super(params);

        this.radius = params.radius;
        this.color = params.color || 'black';
        this.isFill = Boolean(params.isFill);
    }

    static resolveCollision(circleA: Ball, circleB: Ball) {
        const elasticity = (circleA.elasticity + circleB.elasticity) / 2;
        const unitNormal = circleA.position.subtr(circleB.position).unit;
        const unitTangent = unitNormal.normal.unit;

        const v1Normal = Vector.getDot(unitNormal, circleA.linVelocity);
        const v2Normal = Vector.getDot(unitNormal, circleB.linVelocity);

        const v1Tangent = Vector.getDot(unitTangent, circleA.linVelocity);
        const v2Tangent = Vector.getDot(unitTangent, circleB.linVelocity);

        const totalMntm = circleA.mass * v1Normal + circleB.mass * v2Normal;
        const totalMass = circleA.mass + circleB.mass;

        const v1NormalAfter = (elasticity * circleB.mass * (v2Normal - v1Normal) + totalMntm) / totalMass;
        const v2NormalAfter = (elasticity * circleA.mass * (v1Normal - v2Normal) + totalMntm) / totalMass;

        const v1NormalVectorAfter = unitNormal.mult(v1NormalAfter);
        const v2NormalVectorAfter = unitNormal.mult(v2NormalAfter);

        const v1TangentVectorAfter = unitTangent.mult(v1Tangent);
        const v2TangentVectorAfter = unitTangent.mult(v2Tangent);

        circleA.linVelocity = v1NormalVectorAfter.add(v1TangentVectorAfter);
        circleB.linVelocity = v2NormalVectorAfter.add(v2TangentVectorAfter);
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

    public draw(ctx: CanvasRenderingContext2D) {
        drawCircle(ctx, {
            coordinate: this.position,
            radius: this.radius,
            color: this.color,
            isFill: this.isFill,
        });
    }
}

export default Ball;
