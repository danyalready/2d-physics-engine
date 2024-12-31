import Circle from '../../shapes/Circle/Circle';
import Body from '../../bodies/Body/Body';
import Vector2, { type XYCoordinate } from '../../math/Vector2';
import { drawLine } from '../../utils';

type WallParams = {
    coordinates: {
        start: XYCoordinate;
        end: XYCoordinate;
    };
    color?: CSSStyleDeclaration['color'];
};

class Wall {
    public color: CSSStyleDeclaration['color'];
    public start: Vector2;
    public end: Vector2;

    constructor(params: WallParams) {
        this.color = params.color || 'black';
        this.start = new Vector2(params.coordinates.start);
        this.end = new Vector2(params.coordinates.end);
    }

    public isCollision(circle: Circle): boolean {
        const closestPoint = this.getClosestPoint(circle.position);
        const distanceMagnitude = closestPoint.subtr(circle.position).magnitude;

        return distanceMagnitude - circle.radius <= 0;
    }

    public resolvePenetration(circle: Circle) {
        const closestWallPoint = this.getClosestPoint(circle.position);
        const distance = circle.position.subtr(closestWallPoint);
        const penetrationDepth = circle.radius - distance.magnitude;

        circle.position = circle.position.add(distance.unit.mult(penetrationDepth));
    }

    public resolveCollision(physicalObject: Body) {
        const closestWallPoint = this.getClosestPoint(physicalObject.position);
        const distance = physicalObject.position.subtr(closestWallPoint);

        const unitNormal = distance.unit;
        const unitTangent = unitNormal.normal;

        const unitNormalAfter = unitNormal.mult(-1);
        const unitTangentAfter = unitTangent;

        const velocityNormal = Vector2.getDot(unitNormalAfter, physicalObject.linVelocity);
        const velocityTangent = Vector2.getDot(unitTangentAfter, physicalObject.linVelocity);

        const normalAfter = unitNormal.mult(velocityNormal);
        const tangentAfter = unitTangent.mult(velocityTangent);

        physicalObject.linVelocity = normalAfter.add(tangentAfter);
    }

    public getClosestPoint(vector: Vector2): Vector2 {
        const vectorToWallStart = this.start.subtr(vector);
        const wallEndToVector = vector.subtr(this.end);

        if (Vector2.getDot(this.unit, vectorToWallStart) > 0) {
            return this.start;
        }

        if (Vector2.getDot(this.unit, wallEndToVector) > 0) {
            return this.end;
        }

        const scalar = Vector2.getDot(this.unit, vectorToWallStart);
        const closestVector = this.unit.mult(scalar);

        return this.start.subtr(closestVector);
    }

    public get position(): Vector2 {
        return this.end.add(this.start).mult(0.5);
    }

    public get unit(): Vector2 {
        return this.end.subtr(this.start).unit;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        drawLine(ctx, { from: this.start, to: this.end, color: this.color });
    }
}

export default Wall;
