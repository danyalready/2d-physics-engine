import { Entity } from '../../core/Entity';
import { Vector2D } from '../../math/Vector2D';
import { type Component } from '../Component.type';
import { RigidbodyComponent } from '../RigidbodyComponent';

export interface CollisionInfo {
    /** Direction of collision. */
    normal: Vector2D;

    /** Depth of collision. */
    penetration: number;

    /** Point of contact. */
    contact: Vector2D;
}

export interface BoundingBox {
    min: Vector2D;
    max: Vector2D;
}

export abstract class ColliderComponent implements Component {
    readonly componentId = Symbol('Collider');

    constructor(public entity: Entity) {
        // When a collider is added, calculate the rigidbody's inertia if needed
        const rigidBody = entity.getComponent(RigidbodyComponent);

        if (rigidBody) {
            rigidBody.setInertia(this.calculateInertia(rigidBody.getMass()));
        }
    }

    abstract calculateInertia(mass: number): number;
    abstract getCollisionInfo(other: ColliderComponent): CollisionInfo | null;
    abstract getBoundingBox(): BoundingBox;

    update(deltaTime: number): void {}
}
