import { AABB } from '../../math/AABB';
import { Vector2 } from '../../math/Vector2';
import { Collider } from './Collider.abstract';
import { Transform } from '../Transform.component';

export class BoxCollider extends Collider {
    static readonly COLLIDER_ID = Symbol('BoxCollider');
    readonly colliderId = BoxCollider.COLLIDER_ID;

    constructor(
        private width: number,
        private height: number,
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
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        return new AABB(
            new Vector2(position.x - halfWidth, position.y - halfHeight),
            new Vector2(position.x + halfWidth, position.y + halfHeight),
        );
    }

    calculateInertia(mass: number): number {
        // Moment of inertia for a rectangular plate
        // I = (1/12) * m * (w^2 + h^2)
        return (mass * (this.width * this.width + this.height * this.height)) / 12;
    }
}
