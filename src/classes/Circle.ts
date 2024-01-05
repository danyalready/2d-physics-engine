import PhysicalObject, { type PhysicalObjectParams } from './PhysicalObject';
import Vector from './Vector';

import { drawCircle } from '../utils';

type CircleParams = PhysicalObjectParams & {
    radius: number;
    color?: CSSStyleDeclaration['color'];
    isFill?: boolean;
};

class Circle extends PhysicalObject {
    public radius: number;
    public color: CSSStyleDeclaration['color'];
    public isFill: boolean;

    constructor(params: CircleParams) {
        super(params);

        this.radius = params.radius;
        this.color = params.color || 'black';
        this.isFill = Boolean(params.isFill);
    }

    static isCollision(ball1: Circle, ball2: Circle, distance: number): boolean {
        return ball1.radius + ball2.radius >= distance;
    }

    static resolvePenetration(ball1: Circle, ball2: Circle) {
        const distance = ball1.position.subtr(ball2.position);
        const penetrationDepth = ball1.radius + ball2.radius - distance.magnitude;

        if (penetrationDepth <= 0) {
            return;
        }

        const repulse = distance.unit.mult(penetrationDepth / 2);

        ball1.position = ball1.position.add(repulse);
        ball2.position = ball2.position.add(repulse.mult(-1));
    }

    static resolveCollision(ball1: Circle, ball2: Circle) {
        const elasticity = (ball1.elasticity + ball2.elasticity) / 2;
        const unitNormal = ball1.position.subtr(ball2.position).unit;
        const unitTangent = unitNormal.normal.unit;

        const v1Normal = Vector.getDot(unitNormal, ball1.linVelocity);
        const v2Normal = Vector.getDot(unitNormal, ball2.linVelocity);

        const v1Tangent = Vector.getDot(unitTangent, ball1.linVelocity);
        const v2Tangent = Vector.getDot(unitTangent, ball2.linVelocity);

        const totalMntm = ball1.mass * v1Normal + ball2.mass * v2Normal;
        const totalMass = ball1.mass + ball2.mass;

        const v1NormalAfter = (elasticity * ball2.mass * (v2Normal - v1Normal) + totalMntm) / totalMass;
        const v2NormalAfter = (elasticity * ball1.mass * (v1Normal - v2Normal) + totalMntm) / totalMass;

        const v1NormalVectorAfter = unitNormal.mult(v1NormalAfter);
        const v2NormalVectorAfter = unitNormal.mult(v2NormalAfter);

        const v1TangentVectorAfter = unitTangent.mult(v1Tangent);
        const v2TangentVectorAfter = unitTangent.mult(v2Tangent);

        ball1.linVelocity = v1NormalVectorAfter.add(v1TangentVectorAfter);
        ball2.linVelocity = v2NormalVectorAfter.add(v2TangentVectorAfter);
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

export default Circle;
