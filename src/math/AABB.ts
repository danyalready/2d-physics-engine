import { Vector2 } from './Vector2';

/**
 * Axis-Aligned Bounding Box (AABB).
 * Always normalized: min.x <= max.x and min.y <= max.y.
 */
export class AABB {
    public readonly min: Vector2;
    public readonly max: Vector2;

    constructor(min: Vector2, max: Vector2) {
        // Normalize automatically to avoid invalid AABBs
        this.min = new Vector2(Math.min(min.x, max.x), Math.min(min.y, max.y));
        this.max = new Vector2(Math.max(min.x, max.x), Math.max(min.y, max.y));
    }

    /** ---------------- FACTORY HELPERS ---------------- **/

    /** Create AABB from center and half-size. */
    static fromCenter(center: Vector2, halfSize: Vector2): AABB {
        return new AABB(center.subtract(halfSize), center.add(halfSize));
    }

    /** Create AABB from minimum corner and width/height. */
    static fromMinSize(min: Vector2, width: number, height: number): AABB {
        return new AABB(min, new Vector2(min.x + width, min.y + height));
    }

    /** ---------------- GEOMETRY GETTERS ---------------- **/

    get width(): number {
        return this.max.x - this.min.x;
    }

    get height(): number {
        return this.max.y - this.min.y;
    }

    get size(): Vector2 {
        return new Vector2(this.width, this.height);
    }

    get center(): Vector2 {
        return new Vector2((this.min.x + this.max.x) * 0.5, (this.min.y + this.max.y) * 0.5);
    }

    get area(): number {
        return this.width * this.height;
    }

    get perimeter(): number {
        return 2 * (this.width + this.height);
    }

    /** Length of the diagonal. */
    get diagonal(): number {
        return Math.sqrt(this.width ** 2 + this.height ** 2);
    }

    /** Returns true if width or height is zero (degenerate box). */
    get isEmpty(): boolean {
        return this.width === 0 || this.height === 0;
    }

    /** ---------------- OPERATIONS ---------------- **/

    /** Moves the AABB by a vector. */
    move(offset: Vector2): AABB {
        return new AABB(this.min.add(offset), this.max.add(offset));
    }

    /** Expands or shrinks the bounds by a margin. */
    expand(margin: number): AABB {
        return new AABB(
            new Vector2(this.min.x - margin, this.min.y - margin),
            new Vector2(this.max.x + margin, this.max.y + margin),
        );
    }

    /** Returns a copy of this AABB. */
    clone(): AABB {
        return new AABB(this.min.clone(), this.max.clone());
    }

    /** ---------------- CONTAINMENT & INTERSECTION ---------------- **/

    /** Checks if a point is inside the bounds. */
    containsPoint(point: Vector2, inclusive: boolean = true): boolean {
        if (inclusive) {
            return point.x >= this.min.x && point.x <= this.max.x && point.y >= this.min.y && point.y <= this.max.y;
        } else {
            return point.x > this.min.x && point.x < this.max.x && point.y > this.min.y && point.y < this.max.y;
        }
    }

    /** True if two AABBs overlap or touch. */
    intersects(other: AABB, inclusive: boolean = true): boolean {
        if (inclusive) {
            return (
                this.min.x <= other.max.x && this.max.x >= other.min.x && this.min.y <= other.max.y && this.max.y >= other.min.y
            );
        } else {
            return this.min.x < other.max.x && this.max.x > other.min.x && this.min.y < other.max.y && this.max.y > other.min.y;
        }
    }

    /** Returns true if `other` is entirely inside this AABB. */
    contains(other: AABB, inclusive: boolean = true): boolean {
        if (inclusive) {
            return (
                other.min.x >= this.min.x && other.max.x <= this.max.x && other.min.y >= this.min.y && other.max.y <= this.max.y
            );
        } else {
            return other.min.x > this.min.x && other.max.x < this.max.x && other.min.y > this.min.y && other.max.y < this.max.y;
        }
    }

    /** Returns a new AABB which encloses both boxes. */
    union(other: AABB): AABB {
        return new AABB(
            new Vector2(Math.min(this.min.x, other.min.x), Math.min(this.min.y, other.min.y)),
            new Vector2(Math.max(this.max.x, other.max.x), Math.max(this.max.y, other.max.y)),
        );
    }

    /** Returns intersection AABB or null if none. */
    intersection(other: AABB): AABB | null {
        const min = new Vector2(Math.max(this.min.x, other.min.x), Math.max(this.min.y, other.min.y));

        const max = new Vector2(Math.min(this.max.x, other.max.x), Math.min(this.max.y, other.max.y));

        if (min.x <= max.x && min.y <= max.y) {
            return new AABB(min, max);
        }

        return null;
    }
}
