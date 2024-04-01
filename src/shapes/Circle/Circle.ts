import Vector from '../../classes/Vector/Vector';
import { drawCircle } from '../../utils';

export type CircleParams = {
    radius: number;
    position: Vector;
};

class Circle {
    public radius: number;
    public position: Vector;

    constructor(params: CircleParams) {
        this.radius = params.radius;
        this.position = params.position;
    }

    static isCollision(circleA: Circle, circleB: Circle, distance: number): boolean {
        return circleA.radius + circleB.radius >= distance;
    }

    static resolvePenetration(circleA: Circle, circleB: Circle) {
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
        });
    }
}

export default Circle;
