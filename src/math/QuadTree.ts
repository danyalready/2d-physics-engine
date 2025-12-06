import { AABB } from './AABB';
import { Vector2 } from './Vector2';

type NodeKey = 'NE' | 'SE' | 'SW' | 'NW';

export class QuadTree<T> {
    private items: T[] = [];
    private nodes: null | Map<NodeKey, QuadTree<T>> = null;

    constructor(
        public readonly aabb: AABB,
        public readonly maxObjects: number,
        public readonly getAABB: (item: T) => AABB,
    ) {}

    /** Inserts a point into the quadtree. */
    insert(item: T): boolean {
        if (!this.aabb.intersects(this.getAABB(item))) {
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
        const nodeWidth = this.aabb.width / 2;
        const nodeHeight = this.aabb.height / 2;

        this.nodes = new Map([
            ['NE', new QuadTree(new AABB(this.aabb.center, this.aabb.max), this.maxObjects, this.getAABB)],
            [
                'SE',
                new QuadTree(
                    new AABB(
                        this.aabb.center.subtract(new Vector2(0, nodeHeight)),
                        this.aabb.center.add(new Vector2(nodeWidth, 0)),
                    ),
                    this.maxObjects,
                    this.getAABB,
                ),
            ],
            ['SW', new QuadTree(new AABB(this.aabb.min, this.aabb.center), this.maxObjects, this.getAABB)],
            [
                'NW',
                new QuadTree(
                    new AABB(
                        this.aabb.center.subtract(new Vector2(nodeWidth, 0)),
                        this.aabb.center.add(new Vector2(0, nodeHeight)),
                    ),
                    this.maxObjects,
                    this.getAABB,
                ),
            ],
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
            if (range.intersects(this.getAABB(item))) {
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
