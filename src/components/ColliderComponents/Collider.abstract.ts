import { AABB } from '../../math/AABB';
import { Component } from '../Component.abstract';
import { Transform } from '../Transform.component';
import { Entity } from '../../core/Entity';
import { CollisionInfo } from '../../systems/PhysicsSystem/CollisionDetector';

export interface CollisionEvent {
    otherEntity: Entity;
    otherCollider: Collider;
    otherTransform: Transform;
    collisionInfo: CollisionInfo;
}

export abstract class Collider extends Component {
    readonly componentId = Symbol('Collider');
    abstract readonly colliderId: symbol;

    abstract calculateInertia(mass: number): number;
    abstract getAABB(transform: Transform): AABB;

    /**
     * Called when a collision starts (colliders first come into contact)
     */
    onCollideEntry?(event: CollisionEvent): void;

    /**
     * Called every frame while colliders are in contact
     */
    onCollideStay?(event: CollisionEvent): void;

    /**
     * Called when a collision ends (colliders are no longer in contact)
     */
    onCollideExit?(event: CollisionEvent): void;

    // Optional method for broad phase collision detection
    // isBoundingBoxColliding(other: Collider): boolean {
    //     const myBox = this.getBoundingBox();
    //     const otherBox = other.getBoundingBox();

    //     return !(
    //         myBox.max.x < otherBox.min.x ||
    //         myBox.min.x > otherBox.max.x ||
    //         myBox.max.y < otherBox.min.y ||
    //         myBox.min.y > otherBox.max.y
    //     );
    // }
}
