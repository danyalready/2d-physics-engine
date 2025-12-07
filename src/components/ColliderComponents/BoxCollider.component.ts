import { AABB } from '../../math/AABB';
import { Vector2 } from '../../math/Vector2';
import { Collider, type CollisionFilter } from './Collider.abstract';
import { Transform } from '../Transform.component';

export class BoxCollider extends Collider {
    static readonly COLLIDER_ID = Symbol('BoxCollider');
    readonly colliderId = BoxCollider.COLLIDER_ID;

    constructor(
        private width: number,
        private height: number,
        public readonly collisionFilter: CollisionFilter,
    ) {
        super();

        if (width <= 0 || height <= 0) {
            throw new Error('BoxCollider width and height must be greater than 0');
        }
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    getAABB(transform: Transform): AABB {
        const position = transform.getPosition();
        const rot = transform.getRotation();

        const halfW = this.width / 2;
        const halfH = this.height / 2;

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
        return (mass * (this.width * this.width + this.height * this.height)) / 12;
    }
}
