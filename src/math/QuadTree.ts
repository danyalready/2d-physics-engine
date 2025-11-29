import { AABB } from './AABB';
import Vector2 from './Vector2';

type NodeKey = 'NE' | 'SE' | 'SW' | 'NW';

export class QuadTree {
    private points: Vector2[] = [];
    private nodes: null | Map<NodeKey, QuadTree> = null;

    constructor(
        private aabb: AABB,
        private maxObjects: number,
    ) {}

    /** Inserts a point into the quadtree. */
    insert(point: Vector2): boolean {
        if (!this.aabb.containsPoint(point)) {
            return false;
        }

        if (this.points.length < this.maxObjects) {
            this.points.push(point);

            return true;
        }

        if (!this.nodes) {
            this.subdivide();
        }

        if (
            this.nodes?.get('NE')?.insert(point) ||
            this.nodes?.get('SE')?.insert(point) ||
            this.nodes?.get('SW')?.insert(point) ||
            this.nodes?.get('NW')?.insert(point)
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
            ['NE', new QuadTree(new AABB(new Vector2(x, y - height), new Vector2(x + width, y)), this.maxObjects)],
            ['SE', new QuadTree(new AABB(new Vector2(x, y), new Vector2(x + width, y + height)), this.maxObjects)],
            ['SW', new QuadTree(new AABB(new Vector2(x - width, y), new Vector2(x, y + height)), this.maxObjects)],
            ['NW', new QuadTree(new AABB(new Vector2(x - width, y - height), new Vector2(x, y)), this.maxObjects)],
        ]);
    }

    /** Query points within a range. */
    query(range: AABB, foundPoints: Vector2[] = []): Vector2[] {
        // If the range doesn't intersect this node, return
        if (!this.aabb.intersects(range)) {
            return foundPoints;
        }

        // Check points in this node
        for (const point of this.points) {
            if (range.containsPoint(point)) {
                foundPoints.push(point);
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
        this.points = [];
        this.nodes = null;
    }
}
