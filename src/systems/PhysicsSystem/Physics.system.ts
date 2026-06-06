import { CollisionDetector } from './CollisionDetector';
import { type Collision, CollisionResolver } from './CollisionResolver';
import { Collider } from '../../components/ColliderComponents/Collider.abstract';
import { Rigidbody } from '../../components/Rigidbody.component';
import { Transform } from '../../components/Transform.component';
import type { Entity } from '../../core/Entity';
import type { Scene } from '../../core/Scene';
import { System } from '../System.abstract';
import { Vector2 } from '../../math/Vector2';
import { BroadPhase } from './BroadPhase';
import { AABB } from '../../math/AABB';

type CollisionPair = number;

type EntityCollision = Collision & {
    entityA: Entity;
    entityB: Entity;
};

interface StoredCollision {
    colliderA: Collider;
    colliderB: Collider;
    entityA: Entity;
    entityB: Entity;
    transformA: Transform;
    transformB: Transform;
}

export class Physics extends System {
    readonly needsFixedUpdate = true;

    private readonly broadPhase: BroadPhase;
    private readonly collisionDetector = new CollisionDetector();
    private readonly collisionResolver = new CollisionResolver();
    private currentCollisions: Map<CollisionPair, StoredCollision> = new Map();

    constructor(worldBounds: AABB) {
        super();

        this.broadPhase = new BroadPhase(worldBounds, 8);
    }

    update(deltaTime: number, scene: Scene): void {
        const entities = scene.getEntities();

        // Step 1: Update all entities (integrate forces and velocities)
        for (const entity of entities) {
            const transform = entity.getComponent(Transform);
            const rigidbody = entity.getComponent(Rigidbody);

            if (!transform || !rigidbody) continue;

            // Calculate new velocities from accumulated forces
            this.integrateForces(rigidbody, deltaTime);

            // Update positions using new velocities
            this.integrateVelocities(transform, rigidbody, deltaTime);

            // Clear accumulated forces for next frame
            rigidbody.clearForces();
        }

        // Step 2: Detect and resolve collisions after updating positions
        const collisions = this.detectCollisions(entities);
        this.handleCollisionEvents(collisions);
        this.resolveCollisions(collisions);
    }

    private integrateForces(rigidbody: Rigidbody, deltaTime: number): void {
        const velocity = rigidbody.getVelocity();

        // Apply friction force based on current velocity
        if (velocity.getMagnitude() !== 0) {
            // Clamp friction between 0 and 1
            const frictionCoeff = Math.max(0, Math.min(1, rigidbody.getFriction()));

            const frictionForce = velocity.getNormal().scale(-frictionCoeff * velocity.getMagnitude());
            rigidbody.addForce(frictionForce);
        }

        // Update linear velocity from all forces (including friction)
        const acceleration = rigidbody.getAccumulatedForces().scale(rigidbody.getInverseMass());
        const deltaV = acceleration.scale(deltaTime);
        rigidbody.setVelocity(velocity.add(deltaV));

        // Angular velocity decay with clamped friction
        const angularVelocity = rigidbody.getAngularVelocity();
        if (angularVelocity !== 0) {
            const frictionCoeff = Math.max(0, Math.min(1, rigidbody.getFriction()));
            const angularFriction = angularVelocity * (1 - frictionCoeff * deltaTime);
            rigidbody.setAngularVelocity(angularFriction);
        }
    }

    private integrateVelocities(transform: Transform, rigidbody: Rigidbody, deltaTime: number): void {
        // Update position
        const deltaPosition = rigidbody.getVelocity().scale(deltaTime);
        transform.setPosition(transform.getPosition().add(deltaPosition));

        // Update rotation
        const deltaRotation = rigidbody.getAngularVelocity() * deltaTime;
        transform.setRotation(transform.getRotation() + deltaRotation);
    }

    private detectCollisions(entities: Entity[]): EntityCollision[] {
        const collisions: EntityCollision[] = [];
        const colliderEntities: Entity[] = [];
        const rigidbodyEntities: Entity[] = [];

        for (const entity of entities) {
            const collider = entity.getComponent(Collider);
            const transform = entity.getComponent(Transform);

            if (!collider || !transform) continue;

            colliderEntities.push(entity);

            if (entity.getComponent(Rigidbody)) {
                rigidbodyEntities.push(entity);
            }
        }

        if (rigidbodyEntities.length === 0) {
            return collisions;
        }

        // Reset broad-phase and insert collidable entities.
        this.broadPhase.clear();
        for (const entity of colliderEntities) {
            this.broadPhase.add(entity);
        }

        const potentialPairs = this.broadPhase.getPotentialPairs(rigidbodyEntities);

        for (const [entityA, entityB] of potentialPairs) {
            const colliderA = entityA.getComponent(Collider);
            const colliderB = entityB.getComponent(Collider);
            const transformA = entityA.getComponent(Transform);
            const transformB = entityB.getComponent(Transform);

            if (!colliderA || !colliderB || !transformA || !transformB) continue;

            if (
                colliderA.collisionFilters.detector.layer & colliderB.collisionFilters.detector.mask &&
                colliderB.collisionFilters.detector.layer & colliderA.collisionFilters.detector.mask
            ) {
                const collisionInfo = this.collisionDetector.detectCollision(
                    transformA,
                    transformB,
                    colliderA,
                    colliderB,
                );

                if (!collisionInfo) continue;

                collisions.push({
                    colliderA,
                    colliderB,
                    transformA,
                    transformB,
                    info: collisionInfo,
                    rigidbodyA: entityA.getComponent(Rigidbody),
                    rigidbodyB: entityB.getComponent(Rigidbody),
                    entityA,
                    entityB,
                });
            }
        }

        return collisions;
    }

    private resolveCollisions(collisions: EntityCollision[]): void {
        for (const collision of collisions) {
            // Check for layers and masks match to proceed with collision resolution
            if (
                collision.colliderA.collisionFilters.resolver.layer &
                    collision.colliderB.collisionFilters.resolver.mask &&
                collision.colliderB.collisionFilters.resolver.layer &
                    collision.colliderA.collisionFilters.resolver.mask
            ) {
                this.collisionResolver.resolveCollision(collision);
            }
        }
    }

    private handleCollisionEvents(collisions: EntityCollision[]): void {
        const newCollisions = new Map<CollisionPair, StoredCollision>();

        // Process current collisions and detect entry events
        for (const collision of collisions) {
            const { entityA, entityB } = collision;

            const pair = this.getCollisionPair(entityA, entityB);

            // Store this collision
            newCollisions.set(pair, {
                colliderA: collision.colliderA,
                colliderB: collision.colliderB,
                entityA,
                entityB,
                transformA: collision.transformA,
                transformB: collision.transformB,
            });

            // Check if this is a new collision (entry event)
            if (!this.currentCollisions.has(pair)) {
                // Fire onCollideEntry for both colliders
                if (collision.colliderA.onCollideEntry) {
                    collision.colliderA.onCollideEntry({
                        otherEntity: entityB,
                        otherCollider: collision.colliderB,
                        otherTransform: collision.transformB,
                        collisionInfo: collision.info,
                    });
                }

                if (collision.colliderB.onCollideEntry) {
                    collision.colliderB.onCollideEntry({
                        otherEntity: entityA,
                        otherCollider: collision.colliderA,
                        otherTransform: collision.transformA,
                        collisionInfo: {
                            ...collision.info,
                            normal: collision.info.normal.scale(-1), // Reverse normal for B's perspective
                        },
                    });
                }
            } else {
                // Fire onCollideStay for ongoing collisions
                if (collision.colliderA.onCollideStay) {
                    collision.colliderA.onCollideStay({
                        otherEntity: entityB,
                        otherCollider: collision.colliderB,
                        otherTransform: collision.transformB,
                        collisionInfo: collision.info,
                    });
                }

                if (collision.colliderB.onCollideStay) {
                    collision.colliderB.onCollideStay({
                        otherEntity: entityA,
                        otherCollider: collision.colliderA,
                        otherTransform: collision.transformA,
                        collisionInfo: {
                            ...collision.info,
                            normal: collision.info.normal.scale(-1), // Reverse normal for B's perspective
                        },
                    });
                }
            }
        }

        // Detect exit events (collisions that existed before but not now)
        for (const [pair, storedCollision] of this.currentCollisions.entries()) {
            if (!newCollisions.has(pair)) {
                if (storedCollision.colliderA.onCollideExit) {
                    storedCollision.colliderA.onCollideExit({
                        otherEntity: storedCollision.entityB,
                        otherCollider: storedCollision.colliderB,
                        otherTransform: storedCollision.transformB,
                        collisionInfo: {
                            normal: Vector2.zero(),
                            point: Vector2.zero(),
                            penetration: 0,
                        },
                    });
                }

                if (storedCollision.colliderB.onCollideExit) {
                    storedCollision.colliderB.onCollideExit({
                        otherEntity: storedCollision.entityA,
                        otherCollider: storedCollision.colliderA,
                        otherTransform: storedCollision.transformA,
                        collisionInfo: {
                            normal: Vector2.zero(),
                            point: Vector2.zero(),
                            penetration: 0,
                        },
                    });
                }
            }
        }

        // Update current collisions for next frame
        this.currentCollisions = newCollisions;
    }

    private getCollisionPair(entityA: Entity, entityB: Entity): CollisionPair {
        const minId = entityA.id < entityB.id ? entityA.id : entityB.id;
        const maxId = entityA.id < entityB.id ? entityB.id : entityA.id;

        return minId * 4294967296 + maxId;
    }
}
