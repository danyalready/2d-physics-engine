import { Entity } from '../../core/Entity';
import { Vector2D } from '../../math/Vector2D';
import { TransformComponent } from '../TransformComponent';
import { CircleCollider } from './CircleCollider';
import { BoundingBox, Collider, CollisionInfo } from './Collider';

export class RectangleCollider extends Collider {
    constructor(
        entity: Entity,
        private width: number,
        private height: number,
    ) {
        super(entity);
    }

    getWidth(): number {
        return this.width;
    }
    getHeight(): number {
        return this.height;
    }

    calculateInertia(mass: number): number {
        // Moment of inertia for a rectangle
        return (mass * (this.width * this.width + this.height * this.height)) / 12;
    }

    getBoundingBox(): BoundingBox {
        const transform = this.entity.getComponent(TransformComponent);
        if (!transform) return { min: new Vector2D(), max: new Vector2D() };

        const pos = transform.getPosition();
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        // For rotated rectangles, we need to get all corners and find min/max
        const corners = this.getCorners();

        let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;

        for (const corner of corners) {
            minX = Math.min(minX, corner.x);
            minY = Math.min(minY, corner.y);
            maxX = Math.max(maxX, corner.x);
            maxY = Math.max(maxY, corner.y);
        }

        return {
            min: new Vector2D(minX, minY),
            max: new Vector2D(maxX, maxY),
        };
    }

    getCollisionInfo(other: Collider): CollisionInfo | null {
        if (other instanceof CircleCollider) {
            const result = other.getCollisionInfo(this);

            if (result) {
                result.normal = result.normal.scale(-1); // Flip normal

                return result;
            }
        }

        // if (other instanceof RectangleCollider) {
        //     return this.rectangleRectangleCollision(other);
        // }

        return null;
    }

    // private rectangleRectangleCollision(other: RectangleCollider): CollisionInfo | null {
    //     // Implementation using SAT from earlier code
    //     // Returns { normal, penetration, contact } or null
    // }

    private getCorners(): Vector2D[] {
        // Implementation from earlier code
        return [];
    }

    update() {}
}
