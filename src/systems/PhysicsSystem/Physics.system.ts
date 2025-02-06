import { CollisionDetector } from './CollisionDetector';
import { type Collision, CollisionResolver } from './CollisionResolver';
import { Collider } from '../../components/ColliderComponents/Collider.abstract';
import { Rigidbody } from '../../components/Rigidbody.component';
import { Transform } from '../../components/Transform.component';
import { Entity } from '../../core/Entity';
import { Scene } from '../../core/Scene';
import { System } from '../System.abstract';

export class Physics extends System {
    readonly needsFixedUpdate = true;

    private collisionDetector = new CollisionDetector();
    private collisionResolver = new CollisionResolver();

    update(scene: Scene, deltaTime: number): void {
        const entities = scene.getEntities();

        // Step 0: Detect and resolve collisions
        this.resolveCollisions(this.detectCollisions(entities));

        for (const entity of entities) {
            const transform = entity.getComponent(Transform);
            const rigidbody = entity.getComponent(Rigidbody);

            if (!transform || !rigidbody) continue;

            // Step 1: Calculate new velocities from accumulated forces
            this.integrateForces(rigidbody, deltaTime);

            // Step 2: Update positions using new velocities
            this.integrateVelocities(transform, rigidbody, deltaTime);

            // Step 4: Clear accumulated forces for next frame
            rigidbody.clearForces();
        }
    }

    private integrateForces(rigidbody: Rigidbody, deltaTime: number): void {
        const velocity = rigidbody.getVelocity();

        // Apply friction force based on current velocity
        if (velocity.magnitude !== 0) {
            // Clamp friction between 0 and 1
            const frictionCoeff = Math.max(0, Math.min(1, rigidbody.getFriction()));

            const frictionForce = velocity.unit.scale(-frictionCoeff * velocity.magnitude);
            rigidbody.addForce(frictionForce);
        }

        // Update linear velocity from all forces (including friction)
        const acceleration = rigidbody.getAccumulatedForces().scale(rigidbody.getInverseMass());
        const deltaV = acceleration.scale(deltaTime);
        rigidbody.setVelocity(rigidbody.getVelocity().add(deltaV));

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

        // Update rotation (if you're tracking rotation in Transform)
        const deltaRotation = rigidbody.getAngularVelocity() * deltaTime;
        transform.setRotation(transform.getRotation() + deltaRotation);
    }

    private detectCollisions(entities: Entity[]): Collision[] {
        const collisions: Collision[] = [];

        for (let i = 0; i < entities.length - 1; i++) {
            const entityA = entities[i];
            const colliderA = entityA.getComponent(Collider);
            const transformA = entityA.getComponent(Transform);
            const rigidbodyA = entityA.getComponent(Rigidbody);

            if (!colliderA || !transformA) continue;

            for (let j = i + 1; j < entities.length; j++) {
                const entityB = entities[j];
                const colliderB = entityB.getComponent(Collider);
                const transformB = entityB.getComponent(Transform);
                const rigidbodyB = entityB.getComponent(Rigidbody);

                if (!colliderB || !transformB) continue;

                const collisionInfo = this.collisionDetector.detectCollision(transformA, transformB, colliderA, colliderB);

                if (!collisionInfo) continue;

                collisions.push({
                    colliderA,
                    colliderB,
                    rigidbodyA,
                    rigidbodyB,
                    info: collisionInfo,
                });
            }
        }

        return collisions;
    }

    private resolveCollisions(collisions: Collision[]): void {
        for (const collision of collisions) {
            this.collisionResolver.resolveCollision(collision);
        }
    }
}
