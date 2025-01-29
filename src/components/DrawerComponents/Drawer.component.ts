import { Entity } from '../../core/Entity';
import { Component } from '../Component.abstract';
import { Transform } from '../Transform.component';

export class Drawer extends Component {
    readonly componentId = Symbol('Drawer');

    draw(_canvasCtx: CanvasRenderingContext2D, _transform: Transform): void {}

    update(_parentEntity: Entity, _deltaTime: number): void {}
}
