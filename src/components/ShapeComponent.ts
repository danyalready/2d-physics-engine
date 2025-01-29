import { Component } from './Component.abstract';

export class ShapeComponent extends Component {
    readonly componentId = Symbol('Shape');

    update(deltaTime: number): void {}
}
