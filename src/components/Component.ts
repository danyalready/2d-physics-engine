import { Entity } from '../core/Entity';

export interface ComponentType {
    readonly componentId: symbol;

    entity: Entity;

    onStart?(): void;
    onDestroy?(): void;

    update(deltaTime: number): void;
}

export class Component implements ComponentType {
    constructor(
        public readonly componentId: symbol,
        public entity: Entity,
    ) {}

    onStart() {}

    onDestroy() {}

    update(deltaTime: number) {}
}
