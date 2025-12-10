import { AABB } from '../../math/AABB';
import { Vector2 } from '../../math/Vector2';
import { Collider, type CollisionDetectorFilter, type CollisionResolverFilter } from './Collider.abstract';
import { Transform } from '../Transform.component';

export class BoxCollider extends Collider {
    static readonly COLLIDER_ID = Symbol('BoxCollider');
    readonly colliderId = BoxCollider.COLLIDER_ID;

    constructor(
        private size: { width: number; height: number },
        public readonly collisionFilters: {
            detector: CollisionDetectorFilter;
            resolver: CollisionResolverFilter;
        },
    ) {
        super();

        if (this.size.width <= 0 || this.size.height <= 0) {
            throw new Error('BoxCollider width and height must be greater than 0');
        }
    }

    getWidth(): number {
        return this.size.width;
    }

    getHeight(): number {
        return this.size.height;
    }

    getAABB(transform: Transform): AABB {
        const position = transform.getPosition();
        const rot = transform.getRotation();

        const halfW = this.size.width / 2;
        const halfH = this.size.height / 2;

        const cos = Math.cos(rot);
        const sin = Math.sin(rot);

        // Rotated half-extents
        const rX = Math.abs(halfW * cos) + Math.abs(halfH * sin);

        const rY = Math.abs(halfW * sin) + Math.abs(halfH * cos);

        const min = new Vector2(position.x - rX, position.y - rY);
        const max = new Vector2(position.x + rX, position.y + rY);

        return new AABB(min, max);
    }

    calculateInertia(mass: number): number {
        // Moment of inertia for a rectangular plate
        // I = (1/12) * m * (w^2 + h^2)
        return (mass * (this.size.width * this.size.width + this.size.height * this.size.height)) / 12;
    }
}
