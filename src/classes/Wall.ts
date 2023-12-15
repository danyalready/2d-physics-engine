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

    static getClosestPoint(wall: Wall, circle: Circle) {
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

    public get vector() {
        return this.end.subtr(this.start);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        drawLine(ctx, { from: this.start, to: this.end, color: this.color });
    }
}

export default Wall;
