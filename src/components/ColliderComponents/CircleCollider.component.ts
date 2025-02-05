import { AABB } from '../../math/AABB';
import { Vector2D } from '../../math/Vector2D';
import { Collider } from './Collider.abstract';

export class CircleCollider extends Collider {
    static readonly COLLIDER_ID = Symbol('CircleCollider');
    readonly colliderId = CircleCollider.COLLIDER_ID;

    constructor(private radius: number) {
        super();
    }

    getRadius() {
        return this.radius;
    }

    getAABB(): AABB {
        return new AABB(new Vector2D(-this.radius, -this.radius), new Vector2D(this.radius, this.radius));
    }

    calculateInertia(mass: number): number {
        // Moment of inertia for a solid disk
        return (mass * this.radius * this.radius) / 2;
    }

    getClosestPoint(point: Vector2D): Vector2D {
        return point.unit.scale(this.radius);
    }
}
