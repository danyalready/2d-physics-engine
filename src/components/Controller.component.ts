import { Entity } from '../core/Entity';
import { InputManager } from '../core/InputManager';
import { Vector2D } from '../math/Vector2D';
import { Component } from './Component.abstract';
import { Rigidbody } from './Rigidbody.component';
import { Transform } from './Transform.component';

export class Controller extends Component {
    readonly componentId = Symbol('Controller');

    constructor(
        private readonly inputManager: InputManager,
        private readonly moveForce: number,
    ) {
        super();
    }

    update(_deltaTime: number, parentEntity: Entity): void {
        const input = new Vector2D();

        // Get input vector from WASD or arrow keys
        if (this.inputManager.isKeyPressed('w') || this.inputManager.isKeyPressed('ArrowUp')) {
            input.y -= 1;
        }
        if (this.inputManager.isKeyPressed('s') || this.inputManager.isKeyPressed('ArrowDown')) {
            input.y += 1;
        }
        if (this.inputManager.isKeyPressed('a') || this.inputManager.isKeyPressed('ArrowLeft')) {
            input.x -= 1;
        }
        if (this.inputManager.isKeyPressed('d') || this.inputManager.isKeyPressed('ArrowRight')) {
            input.x += 1;
        }

        if (input.magnitude > 0) {
            const force = input.unit.scale(this.moveForce);
            const transform = parentEntity.getComponent(Transform);
            const rigidbody = parentEntity.getComponent(Rigidbody);

            if (!transform) {
                throw new Error(`Entity ${parentEntity.name} must have a Transform component to be controlled.`);
            }

            if (rigidbody) {
                rigidbody.applyImpulse(force);
            } else {
                transform.setPosition(transform.getPosition().add(force));
            }
        }
    }
}
