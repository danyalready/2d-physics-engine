import { Entity } from './Entity';

export class Scene {
    private entities: Entity[];

    constructor() {
        this.entities = [];
    }

    addEntity(entity: Entity): void {
        this.entities.push(entity);
    }

    removeEntity(entity: Entity): void {
        const index = this.entities.indexOf(entity);

        if (index !== -1) {
            this.entities.splice(index, 1);
        }
    }

    update(deltaTime: number): void {
        this.entities.forEach((entity) => entity.update(deltaTime));
    }
}
