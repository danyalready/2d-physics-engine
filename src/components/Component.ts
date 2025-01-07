import { Entity } from '../core/Entity';

export interface Component {
    entity: Entity;
    readonly componentId: symbol;
    onStart?(): void;
    onDestroy?(): void;
    update(deltaTime: number): void;
}
