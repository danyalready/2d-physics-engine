import { Entity } from '../core/Entity';
import { Component } from './Component';

export class AnimatorComponent extends Component {
    constructor(entity: Entity) {
        super(Symbol('Animator'), entity);
    }

    update(deltaTime: number): void {
        // Collision update logic if needed
    }
}
