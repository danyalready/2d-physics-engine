import { Entity } from '../core/Entity';

export interface ComponentType {
    readonly componentId: symbol;

    onStart?(): void;
    onDestroy?(): void;
    update(parentEntity: Entity, deltaTime: number): void;
}

export abstract class Component implements ComponentType {
    abstract readonly componentId: symbol;

    onStart(): void {}
    onDestroy(): void {}

    abstract update(parentEntity: Entity, deltaTime: number): void;
}
