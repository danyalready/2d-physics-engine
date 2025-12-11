import { Component } from '../Component.abstract';

export abstract class Drawer extends Component {
    readonly componentId = Symbol('Drawer');

    abstract draw(canvasCtx: CanvasRenderingContext2D): void;
}
