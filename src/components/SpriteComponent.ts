import { Entity } from '../core/Entity';
import { Component } from './Component';
import { TransformComponent } from './TransformComponent';

export class SpriteComponent extends Component {
    constructor(
        entity: Entity,
        private spriteKey: string,
    ) {
        super(Symbol('Sprite'), entity);
    }

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
