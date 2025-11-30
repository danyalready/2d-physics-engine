import { CollisionInfo } from './CollisionDetector';
import { CircleCollider } from '../../components/ColliderComponents/CircleCollider.component';
import { BoxCollider } from '../../components/ColliderComponents/BoxCollider.component';
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
            this.circleVsCircleResolver.bind(this),
        );

        // Register box vs box collision
        this.registerCollisionResolver<BoxCollider, BoxCollider>(
            BoxCollider.COLLIDER_ID,
            BoxCollider.COLLIDER_ID,
            this.boxVsBoxResolver.bind(this),
        );

        // Register box vs circle collision
        this.registerCollisionResolver<BoxCollider, CircleCollider>(
            BoxCollider.COLLIDER_ID,
            CircleCollider.COLLIDER_ID,
            this.boxVsCircleResolver.bind(this),
        );

        // Register circle vs box collision (reverse)
        this.registerCollisionResolver<CircleCollider, BoxCollider>(
            CircleCollider.COLLIDER_ID,
            BoxCollider.COLLIDER_ID,
            this.circleVsBoxResolver.bind(this),
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

    /** ---------------- Resolvers ---------------- **/

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

    private boxVsBoxResolver(collision: Collision<BoxCollider, BoxCollider>): boolean {
        let { transformA, transformB, rigidbodyA, rigidbodyB } = collision;
        let { penetration, normal } = collision.info;

        if (!rigidbodyA || !rigidbodyB) return false;

        const mA = rigidbodyA.getMass();
        const mB = rigidbodyB.getMass();
        const vA = rigidbodyA.getVelocity();
        const vB = rigidbodyB.getVelocity();

        // Relative velocity
        const relVel = vB.subtract(vA);
        const velAlongNormal = relVel.dotProduct(normal);

        // If bodies are already separating -> no impulse
        if (velAlongNormal > 0) return false;

        // Impulse
        const restitution = (rigidbodyA.getRestitution() + rigidbodyB.getRestitution()) / 2;

        const j = (-(1 + restitution) * velAlongNormal) / (1 / mA + 1 / mB);
        const impulse = normal.scale(j);

        rigidbodyA.setVelocity(vA.subtract(impulse.scale(1 / mA)));
        rigidbodyB.setVelocity(vB.add(impulse.scale(1 / mB)));

        // Position correction
        const percent = 0.8;
        const slop = 0.01;

        const correctionMag = (Math.max(penetration - slop, 0) / (mA + mB)) * percent;
        const correction = normal.scale(correctionMag);

        transformA.setPosition(transformA.getPosition().subtract(correction.scale(mB)));
        transformB.setPosition(transformB.getPosition().add(correction.scale(mA)));

        return true;
    }

    private boxVsCircleResolver(collision: Collision<BoxCollider, CircleCollider>): boolean {
        const { transformA, transformB, rigidbodyA, rigidbodyB } = collision;
        const { penetration, normal } = collision.info;

        if (!rigidbodyA || !rigidbodyB) return false;

        const mA = rigidbodyA.getMass();
        const mB = rigidbodyB.getMass();

        const vA = rigidbodyA.getVelocity();
        const vB = rigidbodyB.getVelocity();

        const restitution = (rigidbodyA.getRestitution() + rigidbodyB.getRestitution()) / 2;

        const vANormal = normal.dotProduct(vA);
        const vBNormal = normal.dotProduct(vB);

        const tangent = normal.getTangent();
        const vATangent = tangent.dotProduct(vA);
        const vBTangent = tangent.dotProduct(vB);

        const totalMomentum = mA * vANormal + mB * vBNormal;
        const totalMass = mA + mB;

        const vANormalAfter = (restitution * mB * (vBNormal - vANormal) + totalMomentum) / totalMass;

        const vBNormalAfter = (restitution * mA * (vANormal - vBNormal) + totalMomentum) / totalMass;

        rigidbodyA.setVelocity(normal.scale(vANormalAfter).add(tangent.scale(vATangent)));

        rigidbodyB.setVelocity(normal.scale(vBNormalAfter).add(tangent.scale(vBTangent)));

        const correction = normal.scale(penetration / totalMass);

        transformA.setPosition(transformA.getPosition().subtract(correction.scale(mB)));

        transformB.setPosition(transformB.getPosition().add(correction.scale(mA)));

        return true;
    }

    private circleVsBoxResolver(collision: Collision<CircleCollider, BoxCollider>): boolean {
        return this.boxVsCircleResolver({ ...collision, colliderA: collision.colliderB, colliderB: collision.colliderA });
    }
}
