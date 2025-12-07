import { AABB } from '../../math/AABB';
import { Vector2 } from '../../math/Vector2';
import { Transform } from '../Transform.component';
import { Collider, type CollisionFilter } from './Collider.abstract';

export class CircleCollider extends Collider {
    static readonly COLLIDER_ID = Symbol('CircleCollider');
    readonly colliderId = CircleCollider.COLLIDER_ID;

    constructor(
        private radius: number,
        public readonly collisionFilter: CollisionFilter,
    ) {
        super();
    }

    getRadius() {
        return this.radius;
    }

    getAABB(transform: Transform): AABB {
        const position = transform.getPosition();

        return new AABB(
            new Vector2(position.x - this.radius, position.y - this.radius),
            new Vector2(position.x + this.radius, position.y + this.radius),
        );
    }

    calculateInertia(mass: number): number {
        // Moment of inertia for a solid disk
        return (mass * this.radius * this.radius) / 2;
    }

    getClosestPoint(point: Vector2): Vector2 {
        return point.getNormal().scale(this.radius);
    }
}
