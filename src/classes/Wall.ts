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
    public positionStart: Vector;
    public positionEnd: Vector;

    constructor(params: WallParams) {
        this.color = params.color || 'black';
        this.positionStart = new Vector(params.coordinates.start);
        this.positionEnd = new Vector(params.coordinates.end);
    }

    public get vector() {
        return this.positionEnd.subtr(this.positionStart);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        drawLine(ctx, { from: this.positionStart, to: this.positionEnd, color: this.color });
    }
}

export default Wall;
