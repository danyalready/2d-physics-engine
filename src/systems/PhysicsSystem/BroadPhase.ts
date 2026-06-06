import type { Entity } from '../../core/Entity';
import { Collider } from '../../components/ColliderComponents/Collider.abstract';
import { Transform } from '../../components/Transform.component';
import { AABB } from '../../math/AABB';
import { QuadTree } from '../../math/QuadTree';

export class BroadPhase {
    private readonly root: QuadTree<Entity>;

    constructor(
        private readonly aabb: AABB,
        private readonly maxObjects: number,
    ) {
        this.root = new QuadTree(this.aabb, this.maxObjects, (entity) => {
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

    getPotentialPairs(queryEntities: Entity[]): Array<[Entity, Entity]> {
        const result: Array<[Entity, Entity]> = [];
        const queryEntityIds = new Set(queryEntities.map((entity) => entity.id));

        for (const entity of queryEntities) {
            const aabb = this.root.getAABB(entity);
            const candidates = this.root.query(aabb);

            for (const candidate of candidates) {
                if (candidate === entity) continue;
                if (queryEntityIds.has(candidate.id) && candidate.id < entity.id) continue;

                result.push([entity, candidate]);
            }
        }

        return result;
    }

    clear(): void {
        this.root.clear();
    }
}
