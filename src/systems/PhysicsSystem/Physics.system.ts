import { CollisionDetector } from './CollisionDetector';
import { type Collision, CollisionResolver } from './CollisionResolver';
import { Collider, CollisionEvent } from '../../components/ColliderComponents/Collider.abstract';
import { Rigidbody } from '../../components/Rigidbody.component';
import { Transform } from '../../components/Transform.component';
import { Entity } from '../../core/Entity';
import { Scene } from '../../core/Scene';
import { System } from '../System.abstract';
import { Vector2 } from '../../math/Vector2';
import { BroadPhase } from './BroadPhase';
import { AABB } from '../../math/AABB';

type CollisionPair = string;

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

        this.broadPhase = new BroadPhase(worldBounds, 1);
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
        this.handleCollisionEvents(collisions, entities);
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

    private detectCollisions(entities: Entity[]): Collision[] {
        const collisions: Collision[] = [];

        // Reset broad-phase and insert entities
        this.broadPhase.clear();
        entities.forEach(this.broadPhase.add);

        const potentialPairs = this.broadPhase.getPotentialPairs();

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
                } as Collision & { entityA: Entity; entityB: Entity });
            }
        }

        return collisions;
    }

    private resolveCollisions(collisions: Collision[]): void {
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

    private handleCollisionEvents(collisions: Collision[], entities: Entity[]): void {
        const newCollisions = new Map<CollisionPair, StoredCollision>();

        // Process current collisions and detect entry events
        for (const collision of collisions) {
            // Get entities from collision if available, otherwise find them
            const entityA =
                (collision as any).entityA || this.findEntityWithCollider(entities, collision.colliderA);
            const entityB =
                (collision as any).entityB || this.findEntityWithCollider(entities, collision.colliderB);

            if (!entityA || !entityB) continue;

            const pair = this.getCollisionPair(entityA, entityB, collision.colliderA, collision.colliderB);

            // Store this collision
            newCollisions.set(pair, {
                colliderA: collision.colliderA,
                colliderB: collision.colliderB,
                entityA,
                entityB,
                transformA: collision.transformA,
                transformB: collision.transformB,
            });

            // Create collision events for both colliders
            const eventA: CollisionEvent = {
                otherEntity: entityB,
                otherCollider: collision.colliderB,
                otherTransform: collision.transformB,
                collisionInfo: collision.info,
            };

            const eventB: CollisionEvent = {
                otherEntity: entityA,
                otherCollider: collision.colliderA,
                otherTransform: collision.transformA,
                collisionInfo: {
                    ...collision.info,
                    normal: collision.info.normal.scale(-1), // Reverse normal for B's perspective
                },
            };

            // Check if this is a new collision (entry event)
            if (!this.currentCollisions.has(pair)) {
                // Fire onCollideEntry for both colliders
                collision.colliderA.onCollideEntry?.(eventA);
                collision.colliderB.onCollideEntry?.(eventB);
            } else {
                // Fire onCollideStay for ongoing collisions
                collision.colliderA.onCollideStay?.(eventA);
                collision.colliderB.onCollideStay?.(eventB);
            }
        }

        // Detect exit events (collisions that existed before but not now)
        for (const [pair, storedCollision] of this.currentCollisions.entries()) {
            if (!newCollisions.has(pair)) {
                // This collision ended - fire exit events
                // Fire onCollideExit for colliderA
                const eventA: CollisionEvent = {
                    otherEntity: storedCollision.entityB,
                    otherCollider: storedCollision.colliderB,
                    otherTransform: storedCollision.transformB,
                    collisionInfo: {
                        normal: new Vector2(0, 0),
                        point: new Vector2(0, 0),
                        penetration: 0,
                    },
                };
                storedCollision.colliderA.onCollideExit?.(eventA);

                // Fire onCollideExit for colliderB
                const eventB: CollisionEvent = {
                    otherEntity: storedCollision.entityA,
                    otherCollider: storedCollision.colliderA,
                    otherTransform: storedCollision.transformA,
                    collisionInfo: {
                        normal: new Vector2(0, 0),
                        point: new Vector2(0, 0),
                        penetration: 0,
                    },
                };
                storedCollision.colliderB.onCollideExit?.(eventB);
            }
        }

        // Update current collisions for next frame
        this.currentCollisions = newCollisions;
    }

    private getCollisionPair(
        entityA: Entity,
        entityB: Entity,
        colliderA: Collider,
        colliderB: Collider,
    ): CollisionPair {
        // Create a unique pair key using entity names and collider IDs (order-independent)
        const entityKeyA = `${entityA.name}:${colliderA.componentId.toString()}`;
        const entityKeyB = `${entityB.name}:${colliderB.componentId.toString()}`;
        return entityKeyA < entityKeyB ? `${entityKeyA}:${entityKeyB}` : `${entityKeyB}:${entityKeyA}`;
    }

    private findEntityWithCollider(entities: Entity[], collider: Collider): Entity | undefined {
        return entities.find((entity) => entity.getComponent(Collider) === collider);
    }
}
