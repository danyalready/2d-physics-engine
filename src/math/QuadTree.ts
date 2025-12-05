import { AABB } from './AABB';
import { Vector2 } from './Vector2';

type NodeKey = 'NE' | 'SE' | 'SW' | 'NW';

export class QuadTree<T> {
    private items: T[] = [];
    private nodes: null | Map<NodeKey, QuadTree<T>> = null;

    constructor(
        private aabb: AABB,
        private maxObjects: number,
        private getAABB: (item: T) => AABB,
    ) {}

    /** Inserts a point into the quadtree. */
    insert(item: T): boolean {
        if (!this.aabb.contains(this.getAABB(item))) {
            return false;
        }

        if (this.items.length < this.maxObjects) {
            this.items.push(item);

            return true;
        }

        if (!this.nodes) {
            this.subdivide();
        }

        if (
            this.nodes?.get('NE')?.insert(item) ||
            this.nodes?.get('SE')?.insert(item) ||
            this.nodes?.get('SW')?.insert(item) ||
            this.nodes?.get('NW')?.insert(item)
        ) {
            return true;
        }

        return false;
    }

    /** Subdivides the current node into four child nodes. */
    private subdivide(): void {
        const { x, y } = this.aabb.center;
        const width = this.aabb.width / 2;
        const height = this.aabb.height / 2;

        this.nodes = new Map([
            ['NE', new QuadTree(new AABB(new Vector2(x, y - height), new Vector2(x + width, y)), this.maxObjects, this.getAABB)],
            ['SE', new QuadTree(new AABB(new Vector2(x, y), new Vector2(x + width, y + height)), this.maxObjects, this.getAABB)],
            ['SW', new QuadTree(new AABB(new Vector2(x - width, y), new Vector2(x, y + height)), this.maxObjects, this.getAABB)],
            ['NW', new QuadTree(new AABB(new Vector2(x - width, y - height), new Vector2(x, y)), this.maxObjects, this.getAABB)],
        ]);
    }

    /** Query points within a range. */
    query(range: AABB, foundPoints: T[] = []): T[] {
        // If the range doesn't intersect this node, return
        if (!this.aabb.intersects(range)) {
            return foundPoints;
        }

        // Check points in this node
        for (const item of this.items) {
            if (range.contains(this.getAABB(item))) {
                foundPoints.push(item);
            }
        }

        // Recursively check child nodes
        if (this.nodes) {
            for (const node of this.nodes.values()) {
                node.query(range, foundPoints);
            }
        }

        return foundPoints;
    }

    /** Clears the quadtree. */
    clear(): void {
        this.items = [];
        this.nodes = null;
    }
}
