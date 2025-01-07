export class Vector2D {
    constructor(
        public x: number = 0,
        public y: number = 0,
    ) {}

    // Basic vector operations

    add(vector: Vector2D): Vector2D {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector: Vector2D): Vector2D {
        return new Vector2D(this.x - vector.x, this.y - vector.y);
    }

    scale(scalar: number): Vector2D {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    divide(scalar: number): Vector2D {
        if (scalar === 0) throw new Error('Division by zero');

        return new Vector2D(this.x / scalar, this.y / scalar);
    }

    /** Vector magnitude (length). */
    get magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    /** Square magnitude (for performance when comparing distances). */
    magnitudeSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    /** Dot product. */
    getDot(vector: Vector2D): number {
        return this.x * vector.x + this.y * vector.y;
    }

    /** Cross product (returns a scalar in 2D). */
    getCross(vector: Vector2D): number {
        return this.x * vector.y - this.y * vector.x;
    }

    /** Radians between vectors. */
    getRadians(vector: Vector2D): number {
        const cosine = this.getDot(vector) / (this.magnitude * vector.magnitude);

        return Math.acos(cosine);
    }

    /** Rotate vector by angle (in radians). */
    rotate(angle: number): Vector2D {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        return new Vector2D(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }

    /** Returns the copy vector. */
    clone(): Vector2D {
        return new Vector2D(this.x, this.y);
    }

    // Calculated vector values

    /** Returns normolized vector (magnitude 1). */
    get unit(): Vector2D {
        if (this.magnitude === 0) return new Vector2D();

        return this.divide(this.magnitude);
    }

    /** Returns perpendicular vector. */
    get normal(): Vector2D {
        return new Vector2D(-this.y, this.x);
    }
}
