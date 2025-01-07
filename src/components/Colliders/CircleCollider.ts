import { Entity } from '../../core/Entity';
import { Vector2D } from '../../math/Vector2D';
import { TransformComponent } from '../TransformComponent';
import { BoundingBox, ColliderComponent, CollisionInfo } from './ColliderComponent';

export class CircleCollider extends ColliderComponent {
    constructor(
        entity: Entity,
        private radius: number,
    ) {
        super(entity);
    }

    getRadius(): number {
        return this.radius;
    }

    calculateInertia(mass: number): number {
        // Moment of inertia for a solid disk
        return (mass * this.radius * this.radius) / 2;
    }

    getBoundingBox(): BoundingBox {
        const pos = this.entity.getComponent(TransformComponent)?.getPosition() || new Vector2D();

        return {
            min: new Vector2D(pos.x - this.radius, pos.y - this.radius),
            max: new Vector2D(pos.x + this.radius, pos.y + this.radius),
        };
    }

    getCollisionInfo(other: ColliderComponent): CollisionInfo | null {
        if (other instanceof CircleCollider) {
            return this.circleCircleCollision(other);
        }

        // if (collider instanceof RectangleCollider) {
        //     return this.circleRectangleCollision(collider);
        // }

        return null;
    }

    private circleCircleCollision(other: CircleCollider): CollisionInfo | null {
        const myPos = this.entity.getComponent(TransformComponent)?.getPosition() || new Vector2D();
        const otherPos = other.entity.getComponent(TransformComponent)?.getPosition() || new Vector2D();

        const diff = otherPos.subtract(myPos);
        const distance = diff.magnitude;
        const sumRadii = this.radius + other.getRadius();

        if (distance < sumRadii) {
            const normal = diff.scale(1 / distance);
            const penetration = sumRadii - distance;
            const contact = myPos.add(normal.scale(this.radius));

            return { normal, penetration, contact };
        }

        return null;
    }

    // private circleRectangleCollision(rect: RectangleCollider): CollisionInfo | null {
    //     // Implementation from earlier code
    //     // Returns { normal, penetration, contact } or null
    // }
}
