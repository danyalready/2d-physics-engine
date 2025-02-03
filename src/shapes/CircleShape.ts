import { AABB } from '../math/AABB';
import { Vector2D } from '../math/Vector2D';
import { Shape } from './Shape.abstract';

export class CircleShape extends Shape {
    constructor(public radius: number) {
        super();
    }

    getAABB(): AABB {
        return new AABB(new Vector2D(-this.radius, -this.radius), new Vector2D(this.radius, this.radius));
    }

    getClosestPoint(point: Vector2D): Vector2D {
        return point.unit.scale(this.radius);
    }
}
