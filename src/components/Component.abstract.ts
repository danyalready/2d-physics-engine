import { Entity } from '../core/Entity';

export abstract class Component {
    abstract readonly componentId: symbol;

    parent!: Entity;

    onStart?(): void;
    onDestroy?(): void;
    update?(deltaTime: number): void;
}
