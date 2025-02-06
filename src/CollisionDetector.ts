import { CircleCollider } from './components/ColliderComponents/CircleCollider.component';
import { Collider } from './components/ColliderComponents/Collider.abstract';
import { Transform } from './components/Transform.component';
import { Vector2D } from './math/Vector2D';

type Detector<T extends Collider = Collider, U extends Collider = Collider> = (
    transformA: Transform,
    transformB: Transform,
    colliderA: T,
    colliderB: U,
) => CollisionInfo | null;

export interface CollisionInfo {
    unit: Vector2D;
    point: Vector2D;
    penetration: number;
}

export class CollisionDetector {
    private collisionMatrix: Map<symbol, Map<symbol, Detector>> = new Map();

    constructor() {
        // Register circle vs circle collision
        this.registerCollisionDetector<CircleCollider, CircleCollider>(
            CircleCollider.COLLIDER_ID,
            CircleCollider.COLLIDER_ID,
            this.circleVsCircleDetector,
        );
    }

    private registerCollisionDetector<T extends Collider, U extends Collider>(
        typeA: symbol,
        typeB: symbol,
        detector: Detector<T, U>,
    ): void {
        if (!this.collisionMatrix.has(typeA)) {
            this.collisionMatrix.set(typeA, new Map());
        }

        this.collisionMatrix.get(typeA)!.set(typeB, detector as Detector);
    }

    detectCollision(
        transformA: Transform,
        transformB: Transform,
        colliderA: Collider,
        colliderB: Collider,
    ): CollisionInfo | null {
        const handlersForA = this.collisionMatrix.get(colliderA.colliderId);
        if (!handlersForA) return null;

        const detector = handlersForA.get(colliderB.colliderId);
        if (!detector) return null;

        return detector(transformA, transformB, colliderA, colliderB);
    }

    private circleVsCircleDetector(
        transformA: Transform,
        transformB: Transform,
        colliderA: CircleCollider,
        colliderB: CircleCollider,
    ): CollisionInfo | null {
        const posA = transformA.getPosition();
        const posB = transformB.getPosition();

        const diff = posB.subtract(posA);
        const distance = diff.magnitude;
        const radiusSum = colliderA.getRadius() + colliderB.getRadius();

        if (radiusSum >= distance) {
            return {
                // Handle perfectly overlapping circles
                unit: distance === 0 ? new Vector2D(1, 0) : diff.unit,
                penetration: radiusSum - distance,
                point: posA.add(diff.unit.scale(colliderA.getRadius())),
            };
        }

        return null;
    }
}
