import { AABB } from '../math/AABB';
import { Vector2D } from '../math/Vector2D';

export abstract class Shape {
    abstract getAABB(): AABB;
    abstract getClosestPoint(point: Vector2D): Vector2D;
}
