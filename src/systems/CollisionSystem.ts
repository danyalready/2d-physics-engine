import { Collider } from '../components/Colliders/Collider';
import { TransformComponent } from '../components/TransformComponent';
import { Entity } from '../core/Entity';
import { Vector2D } from '../math/Vector2D';
import { System } from './System';

export class CollisionSystem extends System {
    private static readonly CELL_SIZE = 100;

    readonly needsFixedUpdate = false;
    private grid: Map<string, Set<Collider>> = new Map();
    private colliders: Set<Collider> = new Set();

    private getCellKey(x: number, y: number): string {
        const cellX = Math.floor(x / CollisionSystem.CELL_SIZE);
        const cellY = Math.floor(y / CollisionSystem.CELL_SIZE);

        return `${cellX},${cellY}`;
    }

    private getNeighboringCells(collider: Collider): string[] {
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

    addCollider(collider: Collider): void {
        this.colliders.add(collider);
        this.updateColliderInGrid(collider);
    }

    removeCollider(collider: Collider): void {
        this.colliders.delete(collider);
        this.removeColliderFromGrid(collider);
    }

    private updateColliderInGrid(collider: Collider): void {
        const cells = this.getNeighboringCells(collider);

        for (const cell of cells) {
            if (!this.grid.has(cell)) {
                this.grid.set(cell, new Set());
            }

            this.grid.get(cell)!.add(collider);
        }
    }

    private removeColliderFromGrid(collider: Collider): void {
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

                    const pairId = [colliderA.componentId, colliderB.componentId].sort().join(',');

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
        const collisionEvent = new CustomEvent('collision', { detail: { otherEntity: entityB } });

        // TODO:
        // entityA.dispatchEvent(collisionEvent);

        const reverseCollisionEvent = new CustomEvent('collision', { detail: { otherEntity: entityA } });

        // TODO:
        // entityB.dispatchEvent(reverseCollisionEvent);
    }
}
