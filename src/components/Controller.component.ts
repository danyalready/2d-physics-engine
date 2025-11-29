import { Entity } from '../core/Entity';
import { InputManager } from '../core/InputManager';
import Vector2 from '../math/Vector2';
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

    update(parentEntity: Entity): void {
        let x = 0;
        let y = 0;

        // Get input vector from WASD or arrow keys
        if (this.inputManager.isKeyPressed('w') || this.inputManager.isKeyPressed('ArrowUp')) {
            y -= 1;
        }
        if (this.inputManager.isKeyPressed('s') || this.inputManager.isKeyPressed('ArrowDown')) {
            y += 1;
        }
        if (this.inputManager.isKeyPressed('a') || this.inputManager.isKeyPressed('ArrowLeft')) {
            x -= 1;
        }
        if (this.inputManager.isKeyPressed('d') || this.inputManager.isKeyPressed('ArrowRight')) {
            x += 1;
        }

        const input = new Vector2(x, y);

        if (input.getMagnitude() > 0) {
            const force = input.getNormal().scale(this.moveForce);
            const transform = parentEntity.getComponent(Transform);
            const rigidbody = parentEntity.getComponent(Rigidbody);

            if (!transform) {
                throw new Error(`Entity ${parentEntity.name} must have a Transform component to be controlled.`);
            }

            if (rigidbody) {
                rigidbody.addForce(force);
            } else {
                transform.setPosition(transform.getPosition().add(force));
            }
        }
    }
}
