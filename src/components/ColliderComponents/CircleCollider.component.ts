import { AABB } from '../../math/AABB';
import { Vector2 } from '../../math/Vector2';
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
        return new AABB(new Vector2(-this.radius, -this.radius), new Vector2(this.radius, this.radius));
    }

    calculateInertia(mass: number): number {
        // Moment of inertia for a solid disk
        return (mass * this.radius * this.radius) / 2;
    }

    getClosestPoint(point: Vector2): Vector2 {
        return point.getNormal().scale(this.radius);
    }
}
