import { Collider } from './Collider.abstract';

export class CircleColliderComponent extends Collider {
    constructor(private radius: number) {
        super();
    }

    getRadius(): number {
        return this.radius;
    }

    calculateInertia(mass: number): number {
        // Moment of inertia for a solid disk
        return (mass * this.radius * this.radius) / 2;
    }

    // getBoundingBox(): BoundingBox {
    //     const pos = this.entity.getComponent(TransformComponent)?.getPosition() || new Vector2D();

    //     return {
    //         min: new Vector2D(pos.x - this.radius, pos.y - this.radius),
    //         max: new Vector2D(pos.x + this.radius, pos.y + this.radius),
    //     };
    // }

    // private circleCollision(other: CircleCollider): CollisionInfo | null {
    //     const myPos = this.entity.getComponent(TransformComponent)?.getPosition() || new Vector2D();
    //     const otherPos = other.entity.getComponent(TransformComponent)?.getPosition() || new Vector2D();

    //     const diff = otherPos.subtract(myPos);
    //     const distance = diff.magnitude;
    //     const sumRadii = this.radius + other.getRadius();

    //     if (distance < sumRadii) {
    //         const normal = diff.scale(1 / distance);
    //         const penetration = sumRadii - distance;
    //         const contact = myPos.add(normal.scale(this.radius));

    //         return { normal, penetration, contact };
    //     }

    //     return null;
    // }

    // checkCollision(other: Collider): CollisionInfo | null {
    //     if (other instanceof CircleCollider) {
    //         return this.circleCollision(other);
    //     }

    //     return null;
    // }

    update() {}
}
