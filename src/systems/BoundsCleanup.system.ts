import { Collider } from '../components/ColliderComponents/Collider.abstract';
import { Transform } from '../components/Transform.component';
import { Scene } from '../core/Scene';
import { AABB } from '../math/AABB';
import { System } from './System.abstract';

export class BoundsCleanupSystem extends System {
    needsFixedUpdate: boolean = false;

    constructor(public bounds: AABB) {
        super();
    }

    update(_deltaTime: number, scene: Scene): void {
        for (const entity of scene.getEntities()) {
            const collider = entity.getComponent(Collider);
            const transform = entity.getComponent(Transform);

            if (!collider || !transform) continue;

            if (!this.bounds.intersects(collider.getAABB(transform))) {
                scene.removeEntity(entity);
            }
        }
    }
}
