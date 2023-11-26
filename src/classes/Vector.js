class Vector {
    constructor(params) {
        this.x = params.x;
        this.y = params.y;
    }

    static dot(vector1, vector2) {
        return vector1.x * vector2.x + vector1.y * vector2.y;
    }

    add(vector) {
        return new Vector({ x: this.x + vector.x, y: this.y + vector.y });
    }

    subtr(vector) {
        return new Vector({ x: this.x - vector.x, y: this.y - vector.y });
    }

    mult(n) {
        return new Vector({ x: this.x * n, y: this.y * n });
    }

    unit() {
        if (this.getMag() === 0) {
            return new Vector({ x: 0, y: 0 });
        }

        return new Vector({ x: this.x / this.getMag(), y: this.y / this.getMag() });
    }

    normal() {
        return new Vector({ x: -this.y, y: this.x });
    }

    getMag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    draw(ctx, params) {
        ctx.beginPath();
        ctx.moveTo(params.x, params.y);
        ctx.lineTo(params.x + this.x * params.n, params.y + this.y * params.n);
        ctx.strokeStyle = params.c;
        ctx.stroke();
        ctx.closePath();
    }
}

export default Vector;
