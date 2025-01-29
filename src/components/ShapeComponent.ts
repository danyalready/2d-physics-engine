import { Entity } from '../core/Entity';
import { Component } from './Component.abstract';

export class ShapeComponent extends Component {
    readonly componentId = Symbol('Shape');

    update(parentEntity: Entity, deltaTime: number): void {}
}
