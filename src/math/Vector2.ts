export default class Vector2 {
    constructor(
        public readonly x: number = 0,
        public readonly y: number = 0,
    ) {}

    /** Returns the magnitude (length) of the vector. */
    getMagnitude(): number {
        return Math.hypot(this.x, this.y);
    }

    /** Returns the squared magnitude (more performant for comparisons). */
    getSquareMagnitude(): number {
        return this.x * this.x + this.y * this.y;
    }

    /** Returns a normalized vector (unit length). */
    getNormal(): Vector2 {
        const mag = this.getMagnitude();
        return mag > 0 ? new Vector2(this.x / mag, this.y / mag) : Vector2.zero();
    }

    /** Returns a vector perpendicular to this one (rotated 90°). */
    getTangent(): Vector2 {
        return new Vector2(-this.y, this.x);
    }

    /** Scales the vector by the given scalar. */
    scale(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    /** Returns a new vector representing this + other. */
    add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    /** Returns a new vector representing this - other. */
    subtract(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    /** Returns a new vector representing this + other * scalar. */
    addScaled(other: Vector2, scalar: number): Vector2 {
        return new Vector2(this.x + other.x * scalar, this.y + other.y * scalar);
    }

    /** Angle in radians between two vectors. */
    radians(other: Vector2): number {
        const magProduct = this.getMagnitude() * other.getMagnitude();
        if (magProduct === 0) return 0; // prevent NaN

        let cos = this.dotProduct(other) / magProduct;

        // Clamp floating point errors
        cos = Math.min(1, Math.max(-1, cos));
        return Math.acos(cos);
    }

    /** Component-wise multiplication. */
    componentProduct(other: Vector2): Vector2 {
        return new Vector2(this.x * other.x, this.y * other.y);
    }

    /** Scalar dot product. */
    dotProduct(other: Vector2): number {
        return this.x * other.x + this.y * other.y;
    }

    /** Scalar 2D cross product. */
    crossProduct(other: Vector2): number {
        return this.x * other.y - this.y * other.x;
    }

    /** Rotates the vector by given radians. */
    rotate(radian: number): Vector2 {
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);
        return new Vector2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }

    /** Returns a copy of this vector. */
    clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    /** Static shorthand constructors. */
    static zero(): Vector2 {
        return new Vector2(0, 0);
    }

    static fromAngle(radian: number): Vector2 {
        return new Vector2(Math.cos(radian), Math.sin(radian));
    }
}
