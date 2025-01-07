import { Entity } from '../core/Entity';

export interface Component {
    readonly componentId: symbol;

    entity: Entity;

    onStart?(): void;
    onDestroy?(): void;

    update(deltaTime: number): void;
}
