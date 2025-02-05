import { AABB } from '../../math/AABB';
import { Component } from '../Component.abstract';
import { Transform } from '../Transform.component';

export abstract class Collider extends Component {
    readonly componentId = Symbol('Collider');
    abstract readonly colliderId: symbol;

    abstract calculateInertia(mass: number): number;
    abstract getAABB(transform: Transform): AABB;

    // Optional method for broad phase collision detection
    // isBoundingBoxColliding(other: Collider): boolean {
    //     const myBox = this.getBoundingBox();
    //     const otherBox = other.getBoundingBox();

    //     return !(
    //         myBox.max.x < otherBox.min.x ||
    //         myBox.min.x > otherBox.max.x ||
    //         myBox.max.y < otherBox.min.y ||
    //         myBox.min.y > otherBox.max.y
    //     );
    // }

    update(): void {}
}
