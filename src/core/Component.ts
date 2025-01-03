import { Entity } from './Entity';

export interface Component {
    entity: Entity;
    update: (deltaTime: number) => void;
}
