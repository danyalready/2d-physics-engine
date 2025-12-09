import { AABB } from '../../math/AABB';
import { Component } from '../Component.abstract';
import { Transform } from '../Transform.component';
import { Entity } from '../../core/Entity';
import { CollisionInfo } from '../../systems/PhysicsSystem/CollisionDetector';

export interface Filter {
    layer: number;
    mask: number;
}

export type CollisionDetectorFilter = Filter;
export type CollisionResolverFilter = Filter;

export interface CollisionEvent {
    otherEntity: Entity;
    otherCollider: Collider;
    otherTransform: Transform;
    collisionInfo: CollisionInfo;
}

export abstract class Collider extends Component {
    readonly componentId = Symbol('Collider');
    abstract readonly colliderId: symbol;
    abstract readonly collisionFilters: {
        detector: CollisionDetectorFilter;
        resolver: CollisionResolverFilter;
    };

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
}
