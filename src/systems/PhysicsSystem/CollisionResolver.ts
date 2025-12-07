import { CollisionInfo } from './CollisionDetector';
import { CircleCollider } from '../../components/ColliderComponents/CircleCollider.component';
import { BoxCollider } from '../../components/ColliderComponents/BoxCollider.component';
import { Collider } from '../../components/ColliderComponents/Collider.abstract';
import { Rigidbody } from '../../components/Rigidbody.component';
import { Transform } from '../../components/Transform.component';
import { Vector2 } from '../../math/Vector2';

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
        this.resolveCollision = this.resolveCollision.bind(this);

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

        const mA = rigidbodyA ? rigidbodyA.getMass() : Infinity;
        const mB = rigidbodyB ? rigidbodyB.getMass() : Infinity;

        const vA = rigidbodyA ? rigidbodyA.getVelocity() : Vector2.zero();
        const vB = rigidbodyB ? rigidbodyB.getVelocity() : Vector2.zero();

        const restitution = (rigidbodyA?.getRestitution() ?? 0) + (rigidbodyB?.getRestitution() ?? 0);

        this.applyImpulseAndCorrection(
            mA,
            mB,
            vA,
            vB,
            normal,
            penetration,
            restitution,
            transformA,
            transformB,
            rigidbodyA,
            rigidbodyB,
        );

        return true;
    }

    private boxVsBoxResolver(collision: Collision<BoxCollider, BoxCollider>): boolean {
        const { transformA, transformB, rigidbodyA, rigidbodyB } = collision;
        const { penetration, normal } = collision.info;

        const mA = rigidbodyA ? rigidbodyA.getMass() : Infinity;
        const mB = rigidbodyB ? rigidbodyB.getMass() : Infinity;

        const vA = rigidbodyA ? rigidbodyA.getVelocity() : Vector2.zero();
        const vB = rigidbodyB ? rigidbodyB.getVelocity() : Vector2.zero();

        const restitution = (rigidbodyA?.getRestitution() ?? 0) + (rigidbodyB?.getRestitution() ?? 0);

        this.applyImpulseAndCorrection(
            mA,
            mB,
            vA,
            vB,
            normal,
            penetration,
            restitution,
            transformA,
            transformB,
            rigidbodyA,
            rigidbodyB,
        );

        return true;
    }

    private boxVsCircleResolver(collision: Collision<BoxCollider, CircleCollider>): boolean {
        const { transformA, transformB, rigidbodyA, rigidbodyB } = collision;
        const { penetration, normal } = collision.info;

        const mA = rigidbodyA ? rigidbodyA.getMass() : 0;
        const mB = rigidbodyB ? rigidbodyB.getMass() : 0;

        const vA = rigidbodyA ? rigidbodyA.getVelocity() : Vector2.zero();
        const vB = rigidbodyB ? rigidbodyB.getVelocity() : Vector2.zero();

        const restitution = (rigidbodyA?.getRestitution() ?? 0) + (rigidbodyB?.getRestitution() ?? 0);

        this.applyImpulseAndCorrection(
            mA,
            mB,
            vA,
            vB,
            normal,
            penetration,
            restitution,
            transformA,
            transformB,
            rigidbodyA,
            rigidbodyB,
        );

        return true;
    }

    private circleVsBoxResolver(collision: Collision<CircleCollider, BoxCollider>): boolean {
        return this.boxVsCircleResolver({
            ...collision,
            colliderA: collision.colliderB,
            colliderB: collision.colliderA,
            rigidbodyA: collision.rigidbodyB,
            rigidbodyB: collision.rigidbodyA,
            transformA: collision.transformB,
            transformB: collision.transformA,
        });
    }

    private applyImpulseAndCorrection(
        mA: number,
        mB: number,
        vA: Vector2,
        vB: Vector2,
        normal: Vector2,
        penetration: number,
        restitution: number,
        transformA: Transform,
        transformB: Transform,
        rigidbodyA?: Rigidbody,
        rigidbodyB?: Rigidbody,
    ) {
        // Static body handling
        const isAStatic = !rigidbodyA;
        const isBStatic = !rigidbodyB;

        // Relative velocity
        const relVel = vB.subtract(vA);
        const velAlongNormal = relVel.dotProduct(normal);

        if (velAlongNormal > 0) return;

        const invMassA = rigidbodyA?.getInverseMass() ?? 0;
        const invMassB = rigidbodyB?.getInverseMass() ?? 0;

        const totalInvMass = invMassA + invMassB;

        if (totalInvMass === 0) return false; // both static

        // If both dynamic: normal impulse
        const e = restitution / 2;
        const j = (-(1 + e) * velAlongNormal) / (invMassA + invMassB);

        const impulse = normal.scale(j);

        // Apply impulse
        if (!isAStatic) rigidbodyA!.setVelocity(vA.subtract(impulse.scale(1 / mA)));
        if (!isBStatic) rigidbodyB!.setVelocity(vB.add(impulse.scale(1 / mB)));

        const correction = normal.scale(penetration / totalInvMass);

        if (invMassA > 0) transformA.setPosition(transformA.getPosition().subtract(correction.scale(invMassA)));

        if (invMassB > 0) transformB.setPosition(transformB.getPosition().add(correction.scale(invMassB)));
    }
}
