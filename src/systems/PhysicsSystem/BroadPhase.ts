import { Entity } from '../../core/Entity';
import { Collider } from '../../components/ColliderComponents/Collider.abstract';
import { Transform } from '../../components/Transform.component';
import { AABB } from '../../math/AABB';
import { QuadTree } from '../../math/QuadTree';

const MAX_OBJECTS: number = 6;

export class BroadPhase {
    private readonly root: QuadTree<Entity>;

    constructor(private readonly aabb: AABB) {
        this.root = new QuadTree(aabb, MAX_OBJECTS, (entity) => {
            const collider = entity.getComponent(Collider);
            const transform = entity.getComponent(Transform);

            if (!collider || !transform) {
                throw new Error('Entity does not have either Collider or Transform components.');
            }

            return collider.getAABB(transform);
        });

        this.add = this.add.bind(this);
    }

    add(entity: Entity): void {
        this.root.insert(entity);
    }

    getPotentialPairs(): Array<[Entity, Entity]> {
        const result: Array<[Entity, Entity]> = [];
        const seen = new Set<string>();

        // 1. Get all entities from the quad-tree
        const allEntities: Entity[] = [];
        this.root.query(this.aabb, allEntities);

        // 2. Find pairs for each entity
        for (let i = 0; i < allEntities.length; i++) {
            const a = allEntities[i];
            const aabb = this.root.getAABB(a);

            // 3. Get all entities around an enity-A
            const candidates = this.root.query(aabb);

            for (const b of candidates) {
                if (a === b) continue;

                // 4. Create IDs to avoid duplicates
                const key = a.id < b.id ? `${a.id}-${b.id}` : `${b.id}-${a.id}`;
                if (seen.has(key)) continue;

                seen.add(key);
                result.push([a, b]);
            }
        }

        return result;
    }

    clear(): void {
        this.root.clear();
    }
}
