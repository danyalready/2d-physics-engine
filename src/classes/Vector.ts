export type Coordinate = { x: number; y: number };

export type Line = { coordinate: Coordinate; n: number; color: CSSStyleDeclaration['color'] };

class Vector {
    x: number;
    y: number;

    constructor(params: Coordinate) {
        this.x = params.x;
        this.y = params.y;
    }

    static dot(vector1: Vector, vector2: Vector) {
        return vector1.x * vector2.x + vector1.y * vector2.y;
    }

    add(vector: Vector) {
        return new Vector({ x: this.x + vector.x, y: this.y + vector.y });
    }

    subtr(vector: Vector) {
        return new Vector({ x: this.x - vector.x, y: this.y - vector.y });
    }

    mult(n: number) {
        return new Vector({ x: this.x * n, y: this.y * n });
    }

    unit() {
        if (this.getMag() === 0) {
            return new Vector({ x: 0, y: 0 });
        }

        return new Vector({
            x: this.x / this.getMag(),
            y: this.y / this.getMag(),
        });
    }

    normal() {
        return new Vector({ x: -this.y, y: this.x });
    }

    getMag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    draw(ctx: CanvasRenderingContext2D, params: Line) {
        ctx.beginPath();
        ctx.moveTo(params.coordinate.x, params.coordinate.y);
        ctx.lineTo(params.coordinate.x + this.x * params.n, params.coordinate.y + this.y * params.n);
        ctx.strokeStyle = params.color;
        ctx.stroke();
        ctx.closePath();
    }
}

export default Vector;
