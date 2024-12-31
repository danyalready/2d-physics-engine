export type XYCoordinate = { x: number; y: number };

export type Line = { coordinate: XYCoordinate; n: number; color: CSSStyleDeclaration['color'] };

export class Vector2 {
    constructor(
        public x: number = 0,
        public y: number = 0,
    ) {}

    // Basic vector operations

    public add(vector: Vector2): Vector2 {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    public subtract(vector: Vector2): Vector2 {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    public multiply(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    public divide(scalar: number): Vector2 {
        if (scalar === 0) throw new Error('Division by zero');

        return new Vector2(this.x / scalar, this.y / scalar);
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
    public getDot(vector: Vector2): number {
        return this.x * vector.x + this.y * vector.y;
    }

    /** Cross product (returns a scalar in 2D). */
    public getCross(vector: Vector2): number {
        return this.x * vector.y - this.y * vector.x;
    }

    /** Radians between vectors. */
    public getRadians(vector: Vector2): number {
        const cosine = this.getDot(vector) / (this.magnitude * vector.magnitude);

        return Math.acos(cosine);
    }

    // Calculated vector values

    /** Returns normolized vector (magnitude 1). */
    public get unit(): Vector2 {
        if (this.magnitude === 0) return new Vector2();

        return this.divide(this.magnitude);
    }

    /** Returns perpendicular vector. */
    public get normal(): Vector2 {
        return new Vector2(-this.y, this.x);
    }
}
