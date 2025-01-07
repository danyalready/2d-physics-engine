import { type Component } from './Component.type';
import { Entity } from '../core/Entity';
import { TransformComponent } from './TransformComponent';

export class SpriteComponent implements Component {
    readonly componentId = Symbol('Sprite');

    constructor(
        public entity: Entity,
        private spriteKey: string,
    ) {}

    update(deltaTime: number): void {
        const transform = this.entity.getComponent(TransformComponent);

        // if (transform) {
        //     const engine = this.entity.getComponent(GameEngine);

        //     if (engine) {
        //         engine.getRenderer().drawSprite(this.spriteKey, transform.position, transform.rotation, transform.scale);
        //     }
        // }
    }
}
