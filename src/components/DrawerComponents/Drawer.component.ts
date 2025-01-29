import { Entity } from '../../core/Entity';
import { Component } from '../Component.abstract';
import { TransformComponent } from '../TransformComponent';

export class Drawer extends Component {
    readonly componentId = Symbol('Drawer');

    draw(_canvasCtx: CanvasRenderingContext2D, _transform: TransformComponent): void {}

    update(_parentEntity: Entity, _deltaTime: number): void {}
}
