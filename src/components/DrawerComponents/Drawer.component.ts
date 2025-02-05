import { Component } from '../Component.abstract';
import { Transform } from '../Transform.component';

export abstract class Drawer extends Component {
    readonly componentId = Symbol('Drawer');

    abstract draw(canvasCtx: CanvasRenderingContext2D, transform: Transform): void;

    update(): void {}
}
