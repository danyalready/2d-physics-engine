import { Vector } from '../../classes';
import { drawCircle } from '../../utils';

export type CircleParams = {
    radius: number;
    position: Vector;

    color?: CSSStyleDeclaration['color'];
    isFill?: boolean;
};

class Circle {
    public radius: number;
    public position: Vector;
    public color: CSSStyleDeclaration['color'];
    public isFill: boolean;

    constructor(params: CircleParams) {
        this.radius = params.radius;
        this.position = params.position;
        this.color = params.color || 'black';
        this.isFill = Boolean(params.isFill);
    }

    static isCollision(circleA: Circle, circleB: Circle): boolean {
        const distance = circleA.position.subtr(circleB.position).magnitude;

        return circleA.radius + circleB.radius >= distance;
    }

    static resolvePenetration(
        circleA: Circle,
        circleB: Circle,
    ): { distance: Vector; penetrationDepth: number; repulse: Vector } {
        const distance = circleA.position.subtr(circleB.position);
        const penetrationDepth = circleA.radius + circleB.radius - distance.magnitude;
        const repulse = distance.unit.mult(penetrationDepth / 2);

        const penetrationDetails = {
            distance,
            penetrationDepth,
            repulse,
        };

        if (penetrationDepth <= 0) {
            return penetrationDetails;
        }

        circleA.position = circleA.position.add(repulse);
        circleB.position = circleB.position.add(repulse.mult(-1));

        return penetrationDetails;
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
