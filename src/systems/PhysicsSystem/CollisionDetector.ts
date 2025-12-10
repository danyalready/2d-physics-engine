import { CircleCollider } from '../../components/ColliderComponents/CircleCollider.component';
import { BoxCollider } from '../../components/ColliderComponents/BoxCollider.component';
import { Collider } from '../../components/ColliderComponents/Collider.abstract';
import { Transform } from '../../components/Transform.component';
import { Vector2 } from '../../math/Vector2';

type Detector<T extends Collider = Collider, U extends Collider = Collider> = (
    transformA: Transform,
    transformB: Transform,
    colliderA: T,
    colliderB: U,
) => CollisionInfo | null;

export interface CollisionInfo {
    normal: Vector2;
    point: Vector2;
    penetration: number;
}

export class CollisionDetector {
    private collisionMatrix: Map<symbol, Map<symbol, Detector>> = new Map();

    constructor() {
        this.detectCollision = this.detectCollision.bind(this);

        // Register circle vs circle collision
        this.registerCollisionDetector<CircleCollider, CircleCollider>(
            CircleCollider.COLLIDER_ID,
            CircleCollider.COLLIDER_ID,
            this.circleVsCircleDetector.bind(this),
        );

        // Register box vs box collision
        this.registerCollisionDetector<BoxCollider, BoxCollider>(
            BoxCollider.COLLIDER_ID,
            BoxCollider.COLLIDER_ID,
            this.boxVsBoxDetector.bind(this),
        );

        // Register box vs circle collision
        this.registerCollisionDetector<BoxCollider, CircleCollider>(
            BoxCollider.COLLIDER_ID,
            CircleCollider.COLLIDER_ID,
            this.boxVsCircleDetector.bind(this),
        );

        // Register circle vs box collision (reverse)
        this.registerCollisionDetector<CircleCollider, BoxCollider>(
            CircleCollider.COLLIDER_ID,
            BoxCollider.COLLIDER_ID,
            this.circleVsBoxDetector.bind(this),
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

    /** ---------------- Detectors ---------------- **/

    private circleVsCircleDetector(
        transformA: Transform,
        transformB: Transform,
        colliderA: CircleCollider,
        colliderB: CircleCollider,
    ): CollisionInfo | null {
        const posA = transformA.getPosition();
        const posB = transformB.getPosition();

        const diff = posB.subtract(posA);
        const distance = diff.getMagnitude();
        const radiusSum = colliderA.getRadius() + colliderB.getRadius();

        if (radiusSum >= distance) {
            return {
                // Handle perfectly overlapping circles
                normal: distance === 0 ? new Vector2(1, 0) : diff.getNormal(),
                penetration: radiusSum - distance,
                point: posA.add(diff.getNormal().scale(colliderA.getRadius())),
            };
        }

        return null;
    }

    private boxVsBoxDetector(
        transformA: Transform,
        transformB: Transform,
        colliderA: BoxCollider,
        colliderB: BoxCollider,
    ): CollisionInfo | null {
        const aabbA = colliderA.getAABB(transformA);
        const aabbB = colliderB.getAABB(transformB);

        if (!aabbA.intersects(aabbB)) return null;

        const overlapX = Math.min(aabbA.max.x - aabbB.min.x, aabbB.max.x - aabbA.min.x);
        const overlapY = Math.min(aabbA.max.y - aabbB.min.y, aabbB.max.y - aabbA.min.y);

        let normal: Vector2;
        let penetration: number;

        if (overlapX < overlapY) {
            // X axis collision
            normal = new Vector2(aabbA.center.x < aabbB.center.x ? 1 : -1, 0);
            penetration = overlapX;
        } else {
            // Y axis collision
            normal = new Vector2(0, aabbA.center.y < aabbB.center.y ? 1 : -1);
            penetration = overlapY;
        }

        const intersection = aabbA.intersection(aabbB);
        const point = intersection ? intersection.center : aabbA.center;

        return {
            normal,
            point,
            penetration,
        };
    }

    private boxVsCircleDetector(
        transformA: Transform,
        transformB: Transform,
        box: BoxCollider,
        circle: CircleCollider,
    ): CollisionInfo | null {
        const boxPos = transformA.getPosition();
        const circlePos = transformB.getPosition();
        const halfW = box.getWidth() / 2;
        const halfH = box.getHeight() / 2;
        const radius = circle.getRadius();
        const rot = transformA.getRotation();

        const cos = Math.cos(rot);
        const sin = Math.sin(rot);

        // Convert circle center into the box's local space using inverse rotation
        const rel = new Vector2(circlePos.x - boxPos.x, circlePos.y - boxPos.y);

        const localCircle = new Vector2(rel.x * cos + rel.y * sin, -rel.x * sin + rel.y * cos);

        // Find closest point on local-space AABB
        const closest = new Vector2(
            Math.max(-halfW, Math.min(localCircle.x, halfW)),
            Math.max(-halfH, Math.min(localCircle.y, halfH)),
        );

        // Vector from closest point to circle center (local)
        const diff = localCircle.subtract(closest);
        const distSq = diff.x * diff.x + diff.y * diff.y;

        // Fast exit — circle doesn't touch
        if (distSq > radius * radius) return null;

        let normalLocal: Vector2;
        let penetration: number;

        // Circle center inside the box (special case)
        if (distSq < 1e-9) {
            // Distances to each face
            const dx = Math.min(halfW - localCircle.x, localCircle.x + halfW);
            const dy = Math.min(halfH - localCircle.y, localCircle.y + halfH);

            if (dx < dy) {
                if (localCircle.x > 0) normalLocal = new Vector2(1, 0);
                else normalLocal = new Vector2(-1, 0);
                penetration = radius + dx;
            } else {
                if (localCircle.y > 0) normalLocal = new Vector2(0, 1);
                else normalLocal = new Vector2(0, -1);
                penetration = radius + dy;
            }
        }

        // Normal overlap (circle contacting an edge or corner)
        else {
            const dist = Math.sqrt(distSq);
            normalLocal = diff.scale(1 / dist);
            penetration = radius - dist;
        }

        // Convert normal to world space
        const normal = new Vector2(
            normalLocal.x * cos - normalLocal.y * sin,
            normalLocal.x * sin + normalLocal.y * cos,
        );

        // Convert contact point to world space
        const contactLocal = closest;
        const contactWorld = new Vector2(
            contactLocal.x * cos - contactLocal.y * sin + boxPos.x,
            contactLocal.x * sin + contactLocal.y * cos + boxPos.y,
        );

        return {
            normal,
            point: contactWorld,
            penetration,
        };
    }

    private circleVsBoxDetector(
        transformA: Transform,
        transformB: Transform,
        colliderA: CircleCollider,
        colliderB: BoxCollider,
    ): CollisionInfo | null {
        // Reverse the collision detection
        const result = this.boxVsCircleDetector(transformB, transformA, colliderB, colliderA);
        if (!result) return null;

        // Flip the normal since we reversed the order
        return {
            normal: result.normal.scale(-1),
            point: result.point,
            penetration: result.penetration,
        };
    }
}
