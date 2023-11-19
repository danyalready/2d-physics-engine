class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    subtr(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    mult(n) {
        return new Vector(this.x * n, this.y * n);
    }

    getMag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
}

export default Vector;
