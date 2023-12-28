import { drawLine } from '../utils';

export type Coordinate = { x: number; y: number };

export type Line = { coordinate: Coordinate; n: number; color: CSSStyleDeclaration['color'] };

class Vector {
    public x: number;
    public y: number;

    constructor(params: Coordinate) {
        this.x = params.x;
        this.y = params.y;
    }

    static getDot(vector1: Vector, vector2: Vector): number {
        return vector1.x * vector2.x + vector1.y * vector2.y;
    }

    static getRadians(vector1: Vector, vector2: Vector): number {
        const cosine = this.getDot(vector1, vector2) / (vector1.magnitude * vector2.magnitude);

        return Math.acos(cosine);
    }

    public add(vector: Vector): Vector {
        return new Vector({ x: this.x + vector.x, y: this.y + vector.y });
    }

    public subtr(vector: Vector): Vector {
        return new Vector({ x: this.x - vector.x, y: this.y - vector.y });
    }

    public mult(n: number): Vector {
        return new Vector({ x: this.x * n, y: this.y * n });
    }

    public get unit(): Vector {
        if (this.magnitude === 0) {
            return new Vector({ x: 0, y: 0 });
        }

        return new Vector({ x: this.x / this.magnitude, y: this.y / this.magnitude });
    }

    public get normal(): Vector {
        return new Vector({ x: -this.y, y: this.x });
    }

    public get magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    public draw(ctx: CanvasRenderingContext2D, params: Line) {
        drawLine(ctx, {
            from: params.coordinate,
            to: {
                x: params.coordinate.x + this.x * params.n,
                y: params.coordinate.y + this.y * params.n,
            },
            color: params.color,
        });
    }
}

export default Vector;
