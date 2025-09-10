export default class Vector2 {
    constructor(
        public x: number = 0,
        public y: number = 0,
    ) {}

    /** Gets the magnitude of this vector. */
    public getMagnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    /** Gets the squared magnitude of this vector. */
    public getSquareMagnitude(): number {
        return this.x ** 2 + this.y ** 2;
    }

    /** Returns a non-zero vector into a vector of unit length. */
    public getNormal(): Vector2 {
        const magnitude = this.getMagnitude();

        if (magnitude > 0) {
            return new Vector2(this.x / magnitude, this.y / magnitude);
        }

        return new Vector2(0, 0);
    }

    /** Returns a perpendicular to itself vector. */
    public getTangent(): Vector2 {
        return new Vector2(-this.y, this.x);
    }

    /** Returns a copy of this vector scaled to the given value. */
    public scale(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    /** Adds the given vector to this. */
    public add(vector: Vector2): Vector2 {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    /** Returns the value of the given vector subtracted from this. */
    public subtract(vector: Vector2): Vector2 {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    /** Adds the given vector to this, scaled by the given amount. */
    public addScaledVector(vector: Vector2, scalar: number): Vector2 {
        return new Vector2(this.x + vector.x * scalar, this.y + vector.y * scalar);
    }

    /** Radians between vectors. */
    public radians(vector: Vector2): number {
        const cosine = this.dotProduct(vector) / (this.getMagnitude() * vector.getMagnitude());

        return Math.acos(cosine);
    }

    /** Calculates and returns a component-wise product of this vector with the given vector. */
    public componentProduct(vector: Vector2): Vector2 {
        return new Vector2(this.x * vector.x, this.y * vector.y);
    }

    /** Calculates and returns the scalar product of this vector with the given vector. */
    public dotProduct(vector: Vector2): number {
        return this.x * vector.x + this.y * vector.y;
    }

    /** Calculates and returns the vector product of this vector with the given vector. */
    public crossProduct(vector: Vector2): number {
        return this.x * vector.y - this.y * vector.x;
    }

    /** Returns the rotated vector by the given radian. */
    public rotate(radian: number): Vector2 {
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);

        return new Vector2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }

    /** Returns a copy vector of itself. */
    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }
}
