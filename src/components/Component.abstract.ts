import { Entity } from '../core/Entity';

export abstract class Component {
    abstract readonly componentId: symbol;

    onStart?(): void;
    onDestroy?(): void;
    update?(deltaTime: number, parentEntity: Entity): void;
}
