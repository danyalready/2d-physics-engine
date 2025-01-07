export class Vector2D {
    constructor(
        public x: number = 0,
        public y: number = 0,
    ) {}

    // Basic vector operations

    public add(vector: Vector2D): Vector2D {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }

    public subtract(vector: Vector2D): Vector2D {
        return new Vector2D(this.x - vector.x, this.y - vector.y);
    }

    public scale(scalar: number): Vector2D {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    public divide(scalar: number): Vector2D {
        if (scalar === 0) throw new Error('Division by zero');

        return new Vector2D(this.x / scalar, this.y / scalar);
    }

    /** Vector magnitude (length). */
    public get magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    /** Square magnitude (for performance when comparing distances). */
    public magnitudeSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    /** Dot product. */
    public getDot(vector: Vector2D): number {
        return this.x * vector.x + this.y * vector.y;
    }

    /** Cross product (returns a scalar in 2D). */
    public getCross(vector: Vector2D): number {
        return this.x * vector.y - this.y * vector.x;
    }

    /** Radians between vectors. */
    public getRadians(vector: Vector2D): number {
        const cosine = this.getDot(vector) / (this.magnitude * vector.magnitude);

        return Math.acos(cosine);
    }

    /** Rotate vector by angle (in radians). */
    public rotate(angle: number): Vector2D {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        return new Vector2D(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }

    /** Returns the copy vector. */
    public clone(): Vector2D {
        return new Vector2D(this.x, this.y);
    }

    // Calculated vector values

    /** Returns normolized vector (magnitude 1). */
    public get unit(): Vector2D {
        if (this.magnitude === 0) return new Vector2D();

        return this.divide(this.magnitude);
    }

    /** Returns perpendicular vector. */
    public get normal(): Vector2D {
        return new Vector2D(-this.y, this.x);
    }
}
