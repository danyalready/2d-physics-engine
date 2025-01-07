import type { Component } from './Component';
import { Entity } from '../core/Entity';
import { Transform } from './Transform';

export class SpriteComponent implements Component {
    constructor(
        public entity: Entity,
        private spriteKey: string,
    ) {}

    update(deltaTime: number): void {
        const transform = this.entity.getComponent(Transform);

        if (transform) {
            const engine = this.entity.getComponent(GameEngine);

            if (engine) {
                engine.getRenderer().drawSprite(this.spriteKey, transform.position, transform.rotation, transform.scale);
            }
        }
    }
}
