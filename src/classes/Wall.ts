import Circle from './Circle';
import Vector, { type Coordinate } from './Vector';
import { drawLine } from '../utils';

type WallParams = {
    coordinates: {
        start: Coordinate;
        end: Coordinate;
    };
    color?: CSSStyleDeclaration['color'];
};

class Wall {
    public color: CSSStyleDeclaration['color'];
    public start: Vector;
    public end: Vector;

    constructor(params: WallParams) {
        this.color = params.color || 'black';
        this.start = new Vector(params.coordinates.start);
        this.end = new Vector(params.coordinates.end);
    }

    static isCollision(wall: Wall, circle: Circle): boolean {
        const closestPoint = this.getClosestPoint(wall, circle);
        const distanceMagnitude = closestPoint.subtr(circle.position).magnitude;

        return distanceMagnitude - circle.radius <= 0;
    }

    static resolvePenetration(wall: Wall, circle: Circle) {
        const closestWallPoint = this.getClosestPoint(wall, circle);
        const distance = circle.position.subtr(closestWallPoint);
        const penetrationDepth = circle.radius - distance.magnitude;

        circle.position = circle.position.add(distance.unit.mult(penetrationDepth));
    }

    static resolveCollision(wall: Wall, circle: Circle) {
        const closestWallPoint = this.getClosestPoint(wall, circle);
        const distance = circle.position.subtr(closestWallPoint);

        const unitNormal = distance.unit;
        const unitTangent = unitNormal.normal;

        const unitNormalAfter = unitNormal.mult(-1);
        const unitTangentAfter = unitTangent;

        const velocityNormal = Vector.getDot(unitNormalAfter, circle.velocity);
        const velocityTangent = Vector.getDot(unitTangentAfter, circle.velocity);

        const normalAfter = unitNormal.mult(velocityNormal);
        const tangentAfter = unitTangent.mult(velocityTangent);

        circle.velocity = normalAfter.add(tangentAfter);
    }

    static getClosestPoint(wall: Wall, circle: Circle): Vector {
        const ballToWallStart = wall.start.subtr(circle.position);
        const ballToWallEnd = circle.position.subtr(wall.end);

        if (Vector.getDot(wall.vector.unit, ballToWallStart) > 0) {
            return wall.start;
        }

        if (Vector.getDot(wall.vector.unit, ballToWallEnd) > 0) {
            return wall.end;
        }

        const scalar = Vector.getDot(wall.vector.unit, ballToWallStart);
        const closestVector = wall.vector.unit.mult(scalar);

        return wall.start.subtr(closestVector);
    }

    public get vector(): Vector {
        return this.end.subtr(this.start);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        drawLine(ctx, { from: this.start, to: this.end, color: this.color });
    }
}

export default Wall;
