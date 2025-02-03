import { Vector2D } from './Vector2D';

export class AABB {
    constructor(
        public min: Vector2D,
        public max: Vector2D,
    ) {}

    get width(): number {
        return this.max.x - this.min.x;
    }

    get height(): number {
        return this.max.y - this.min.y;
    }

    get center(): Vector2D {
        return this.min.add(this.max).scale(0.5);
    }

    /** Checks if a point is inside the bounds. */
    containsPoint(point: Vector2D): boolean {
        return point.x >= this.min.x && point.x <= this.max.x && point.y >= this.min.y && point.y <= this.max.y;
    }

    /** Checks if another bounds overlaps with this one. */
    intersects(other: AABB): boolean {
        return this.min.x <= other.max.x && this.max.x >= other.min.x && this.min.y <= other.max.y && this.max.y >= other.min.y;
    }

    /** Checks if another bounds is completely contained within this one. */
    contains(other: AABB): boolean {
        return other.min.x >= this.min.x && other.max.x <= this.max.x && other.min.y >= this.min.y && other.max.y <= this.max.y;
    }

    /** Creates bounds that contain both this bounds and another. */
    union(other: AABB): AABB {
        return new AABB(
            new Vector2D(Math.min(this.min.x, other.min.x), Math.min(this.min.y, other.min.y)),
            new Vector2D(Math.max(this.max.x, other.max.x), Math.max(this.max.y, other.max.y)),
        );
    }

    /** Creates bounds representing the intersection of this bounds and another. */
    intersection(other: AABB): AABB | null {
        const min = new Vector2D(Math.max(this.min.x, other.min.x), Math.max(this.min.y, other.min.y));
        const max = new Vector2D(Math.min(this.max.x, other.max.x), Math.min(this.max.y, other.max.y));

        // Check if there is a valid intersection
        if (min.x <= max.x && min.y <= max.y) {
            return new AABB(min, max);
        }

        return null;
    }

    /** Expands bounds by a margin. */
    expand(margin: number): AABB {
        return new AABB(
            new Vector2D(this.min.x - margin, this.min.y - margin),
            new Vector2D(this.max.x + margin, this.max.y + margin),
        );
    }

    /** Creates a copy of this bounds. */
    clone(): AABB {
        return new AABB(this.min.clone(), this.max.clone());
    }
}
