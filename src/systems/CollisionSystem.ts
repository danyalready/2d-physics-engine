import { ColliderComponent } from '../components/ColliderComponent';
import { TransformComponent } from '../components/TransformComponent';
import { Vector2D } from '../math/Vector2D';
import type { System } from './System.type';

export class CollisionSystem implements System {
    private static readonly CELL_SIZE = 100;
    private grid: Map<string, Set<ColliderComponent>> = new Map();
    private colliders: Set<ColliderComponent> = new Set();

    private getCellKey(x: number, y: number): string {
        const cellX = Math.floor(x / CollisionSystem.CELL_SIZE);
        const cellY = Math.floor(y / CollisionSystem.CELL_SIZE);
        return `${cellX},${cellY}`;
    }

    private getNeighboringCells(collider: ColliderComponent): string[] {
        const pos = collider.entity.getComponent(TransformComponent)?.getPosition() || new Vector2D();
        const bounds = collider.getBounds();
        const minX = Math.floor((pos.x - bounds.width / 2) / CollisionSystem.CELL_SIZE);
        const maxX = Math.floor((pos.x + bounds.width / 2) / CollisionSystem.CELL_SIZE);
        const minY = Math.floor((pos.y - bounds.height / 2) / CollisionSystem.CELL_SIZE);
        const maxY = Math.floor((pos.y + bounds.height / 2) / CollisionSystem.CELL_SIZE);

        const cells: string[] = [];
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                cells.push(this.getCellKey(x, y));
            }
        }
        return cells;
    }

    addCollider(collider: ColliderComponent): void {
        this.colliders.add(collider);
        this.updateColliderInGrid(collider);
    }

    removeCollider(collider: ColliderComponent): void {
        this.colliders.delete(collider);
        this.removeColliderFromGrid(collider);
    }

    private updateColliderInGrid(collider: ColliderComponent): void {
        const cells = this.getNeighboringCells(collider);
        for (const cell of cells) {
            if (!this.grid.has(cell)) {
                this.grid.set(cell, new Set());
            }
            this.grid.get(cell)!.add(collider);
        }
    }

    private removeColliderFromGrid(collider: ColliderComponent): void {
        for (const cellColliders of this.grid.values()) {
            cellColliders.delete(collider);
        }
    }

    update(): void {
        // Clear and rebuild grid
        this.grid.clear();
        for (const collider of this.colliders) {
            this.updateColliderInGrid(collider);
        }

        // Check collisions efficiently using spatial partitioning
        const checkedPairs = new Set<string>();

        for (const [cell, colliders] of this.grid) {
            for (const colliderA of colliders) {
                for (const colliderB of colliders) {
                    if (colliderA === colliderB) continue;

                    const pairId = [colliderA.id, colliderB.id].sort().join(',');
                    if (checkedPairs.has(pairId)) continue;

                    checkedPairs.add(pairId);
                    if (colliderA.intersects(colliderB)) {
                        this.handleCollision(colliderA.entity, colliderB.entity);
                    }
                }
            }
        }
    }

    private handleCollision(entityA: Entity, entityB: Entity): void {
        // Dispatch collision events to both entities
        const collisionEvent = new CustomEvent('collision', {
            detail: { otherEntity: entityB },
        });
        entityA.dispatchEvent(collisionEvent);

        const reverseCollisionEvent = new CustomEvent('collision', {
            detail: { otherEntity: entityA },
        });
        entityB.dispatchEvent(reverseCollisionEvent);
    }
}
