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
        colliderA: BoxCollider,
        colliderB: CircleCollider,
    ): CollisionInfo | null {
        const aabb = colliderA.getAABB(transformA);
        const circlePos = transformB.getPosition();
        const radius = colliderB.getRadius();

        // Find closest point on AABB to circle center
        const closestX = Math.max(aabb.min.x, Math.min(circlePos.x, aabb.max.x));
        const closestY = Math.max(aabb.min.y, Math.min(circlePos.y, aabb.max.y));
        const closestPoint = new Vector2(closestX, closestY);

        // Calculate distance from closest point to circle center
        const distanceVec = circlePos.subtract(closestPoint);
        const distanceSquared = distanceVec.dotProduct(distanceVec);
        const radiusSquared = radius * radius;

        if (distanceSquared > radiusSquared) {
            return null; // No collision
        }

        // Calculate penetration and normal
        const distanceMagnitude = Math.sqrt(distanceSquared);

        // Handle case where circle center is inside the box
        if (distanceMagnitude === 0) {
            // Find the minimum distance to box edge
            const distToLeft = circlePos.x - aabb.min.x;
            const distToRight = aabb.max.x - circlePos.x;
            const distToTop = circlePos.y - aabb.min.y;
            const distToBottom = aabb.max.y - circlePos.y;

            const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);

            if (minDist === distToLeft) {
                return {
                    normal: new Vector2(-1, 0), // Push circle to the left (away from box)
                    point: new Vector2(aabb.min.x, circlePos.y),
                    penetration: radius + minDist,
                };
            } else if (minDist === distToRight) {
                return {
                    normal: new Vector2(1, 0), // Push circle to the right (away from box)
                    point: new Vector2(aabb.max.x, circlePos.y),
                    penetration: radius + minDist,
                };
            } else if (minDist === distToTop) {
                return {
                    normal: new Vector2(0, -1), // Push circle up (away from box)
                    point: new Vector2(circlePos.x, aabb.min.y),
                    penetration: radius + minDist,
                };
            } else {
                return {
                    normal: new Vector2(0, 1), // Push circle down (away from box)
                    point: new Vector2(circlePos.x, aabb.max.y),
                    penetration: radius + minDist,
                };
            }
        }

        // Normal points from box to circle (to separate them)
        const normal = distanceMagnitude > 0 ? distanceVec.scale(1 / distanceMagnitude) : new Vector2(1, 0);
        const point = closestPoint;
        const penetration = radius - distanceMagnitude;

        return {
            normal,
            point,
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
