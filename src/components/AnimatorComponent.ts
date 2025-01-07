import { Entity } from '../core/Entity';
import { type Component } from './Component.type';

export class AnimatorComponent implements Component {
    readonly componentId = Symbol('Animator');

    constructor(public entity: Entity) {}

    update(deltaTime: number): void {
        // Collision update logic if needed
    }
}
