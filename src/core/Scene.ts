import { Entity } from './Entity';

export class Scene {
    private entities = new Set<Entity>();
    private entityCache: Entity[] | null = null;

    addEntity(entity: Entity): void {
        this.entities.add(entity);
        this.entityCache = null;
    }

    removeEntity(entity: Entity): void {
        this.entities.delete(entity);
        this.entityCache = null;
    }

    getEntities(): Entity[] {
        if (!this.entityCache) {
            this.entityCache = Array.from(this.entities);
        }

        return this.entityCache;
    }

    update(deltaTime: number): void {
        for (const entity of this.entities) {
            entity.update(deltaTime);
        }
    }

    onLoad(): void {
        // Initialize scene resources
    }

    onUnload(): void {
        // Cleanup scene resources
        for (const entity of this.entities) {
            entity.destroy();
        }

        this.entities.clear();
        this.entityCache = null;
    }
}
