import { CollisionInfo } from './CollisionDetector';
import { CircleCollider } from '../../components/ColliderComponents/CircleCollider.component';
import { Collider } from '../../components/ColliderComponents/Collider.abstract';
import { Rigidbody } from '../../components/Rigidbody.component';

export interface Collision<T extends Collider = Collider, U extends Collider = Collider> {
    colliderA: T;
    colliderB: U;
    rigidbodyA?: Rigidbody;
    rigidbodyB?: Rigidbody;
    info: CollisionInfo;
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
        return false;
    }
}
