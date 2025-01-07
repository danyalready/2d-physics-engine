import { TransformComponent } from './TransformComponent';
import { Vector2D } from '../math/Vector2D';
import { Entity } from '../core/Entity';
import { type Component } from './Component.type';

export class ColliderComponent implements Component {
    readonly componentId = Symbol('Collider');

    private bounds: { width: number; height: number };

    constructor(
        public entity: Entity,
        public width: number,
        public height: number,
    ) {
        this.bounds = { width, height };
    }

    // Check if this collider intersects with another collider
    intersects(other: ColliderComponent): boolean {
        const myPos = this.entity.getComponent(TransformComponent)?.getPosition() || new Vector2D();
        const otherPos = other.entity.getComponent(TransformComponent)?.getPosition() || new Vector2D();

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
