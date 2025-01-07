import { Transform } from './Transform';
import { Vector2D } from '../math/Vector2D';
import type { Component } from './Component';
import { Entity } from '../core/Entity';

export class Collider implements Component {
    private bounds: { width: number; height: number };

    constructor(
        public entity: Entity,
        width: number,
        height: number,
    ) {
        this.bounds = { width, height };
    }

    // Check if this collider intersects with another collider
    intersects(other: Collider): boolean {
        const myPos = this.entity.getComponent(Transform)?.getPosition() || new Vector2D();
        const otherPos = other.entity.getComponent(Transform)?.getPosition() || new Vector2D();

        return (
            myPos.x - this.bounds.width / 2 < otherPos.x + other.bounds.width / 2 &&
            myPos.x + this.bounds.width / 2 > otherPos.x - other.bounds.width / 2 &&
            myPos.y - this.bounds.height / 2 < otherPos.y + other.bounds.height / 2 &&
            myPos.y + this.bounds.height / 2 > otherPos.y - other.bounds.height / 2
        );
    }

    update(deltaTime: number): void {
        // Collision update logic if needed
    }
}
