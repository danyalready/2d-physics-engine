import { SpriteComponent } from '../components/SpriteComponent';
import { TransformComponent } from '../components/TransformComponent';
import { Entity } from './Entity';
import { Renderer } from './Renderer';

export class Scene {
    private entities = new Set<Entity>();
    private entityCache: Entity[] | null = null;

    addEntity(entity: Entity): void {
        this.entities.add(entity);
        this.entityCache = null; // Invalidate cache
    }

    removeEntity(entity: Entity): void {
        this.entities.delete(entity);
        this.entityCache = null; // Invalidate cache
    }

    getAllEntities(): Entity[] {
        // Cache entities array to avoid recreating it every frame
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

    render(renderer: Renderer): void {
        for (const entity of this.entities) {
            const sprite = entity.getComponent(SpriteComponent);
            const transform = entity.getComponent(TransformComponent);

            if (sprite && transform) {
                // Render entity
                sprite.render(renderer, transform);
            }
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
