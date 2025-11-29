import { CollisionInfo } from './CollisionDetector';
import { CircleCollider } from '../../components/ColliderComponents/CircleCollider.component';
import { Collider } from '../../components/ColliderComponents/Collider.abstract';
import { Rigidbody } from '../../components/Rigidbody.component';
import { Transform } from '../../components/Transform.component';

export interface Collision<T extends Collider = Collider, U extends Collider = Collider> {
    colliderA: T;
    colliderB: U;
    transformA: Transform;
    transformB: Transform;
    info: CollisionInfo;
    rigidbodyA?: Rigidbody;
    rigidbodyB?: Rigidbody;
}

type Resolver<T extends Collider = Collider, U extends Collider = Collider> = (collision: Collision<T, U>) => boolean;

export class CollisionResolver {
    private collisionMatrix: Map<symbol, Map<symbol, Resolver>> = new Map();

    constructor() {
        // Register circle vs circle collision
        this.registerCollisionResolver<CircleCollider, CircleCollider>(
            CircleCollider.COLLIDER_ID,
            CircleCollider.COLLIDER_ID,
            this.circleVsCircleResolver,
        );
    }

    private registerCollisionResolver<T extends Collider, U extends Collider>(
        typeA: symbol,
        typeB: symbol,
        resolver: Resolver<T, U>,
    ): void {
        if (!this.collisionMatrix.has(typeA)) {
            this.collisionMatrix.set(typeA, new Map());
        }

        this.collisionMatrix.get(typeA)!.set(typeB, resolver as Resolver);
    }

    resolveCollision(collision: Collision): boolean {
        const handlersForA = this.collisionMatrix.get(collision.colliderA.colliderId);
        if (!handlersForA) return false;

        const resolver = handlersForA.get(collision.colliderB.colliderId);
        if (!resolver) return false;

        return resolver(collision);
    }

    private circleVsCircleResolver(collision: Collision<CircleCollider, CircleCollider>): boolean {
        const { transformA, transformB, rigidbodyA, rigidbodyB } = collision;
        const { penetration, normal } = collision.info;

        if (!rigidbodyA || !rigidbodyB) {
            return false; // No rigidbodies attached, cannot resolve collision
        }

        // Coefficient of Restitution (average of both colliders)
        const effectiveCR = (rigidbodyA.getRestitution() + rigidbodyB.getRestitution()) / 2;

        // Velocity components along the collision normal
        const vANormal = normal.dotProduct(rigidbodyA.getVelocity());
        const vBNormal = normal.dotProduct(rigidbodyB.getVelocity());

        // Velocity components along the tangent (perpendicular to normal)
        const tangent = normal.getTangent();
        const vATangent = tangent.dotProduct(rigidbodyA.getVelocity());
        const vBTangent = tangent.dotProduct(rigidbodyB.getVelocity());

        // Total momentum and mass
        const totalMomentum = rigidbodyA.getMass() * vANormal + rigidbodyB.getMass() * vBNormal;
        const totalMass = rigidbodyA.getMass() + rigidbodyB.getMass();

        // New normal velocities after collision
        const vANormalAfter = (effectiveCR * rigidbodyB.getMass() * (vBNormal - vANormal) + totalMomentum) / totalMass;
        const vBNormalAfter = (effectiveCR * rigidbodyA.getMass() * (vANormal - vBNormal) + totalMomentum) / totalMass;

        // Update velocities
        rigidbodyA.setVelocity(normal.scale(vANormalAfter).add(tangent.scale(vATangent)));
        rigidbodyB.setVelocity(normal.scale(vBNormalAfter).add(tangent.scale(vBTangent)));

        // Resolve penetration by adjusting positions
        const resolutionVector = normal.scale(penetration / totalMass);
        transformA.setPosition(transformA.getPosition().subtract(resolutionVector.scale(rigidbodyB.getMass())));
        transformB.setPosition(transformB.getPosition().add(resolutionVector.scale(rigidbodyA.getMass())));

        return true;
    }
}
