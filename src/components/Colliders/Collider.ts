import { Entity } from '../../core/Entity';
import { Vector2D } from '../../math/Vector2D';
import { Component } from '../Component';
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

export abstract class Collider extends Component {
    constructor(entity: Entity) {
        super(Symbol('Collider'), entity);

        // When a collider is added, calculate the rigidbody's inertia if needed
        const rigidBody = entity.getComponent(RigidbodyComponent);

        if (rigidBody) {
            rigidBody.setInertia(this.calculateInertia(rigidBody.getMass()));
        }
    }

    abstract calculateInertia(mass: number): number;
    abstract getBoundingBox(): BoundingBox;

    abstract checkCollision(other: Collider): CollisionInfo | null;
}
