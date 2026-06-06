import { AABB } from './AABB';
import { Vector2 } from './Vector2';

type Nodes<T> = {
    ne: QuadTree<T>;
    se: QuadTree<T>;
    sw: QuadTree<T>;
    nw: QuadTree<T>;
};

export class QuadTree<T> {
    private items: T[] = [];
    private nodes: Nodes<T> | null = null;

    constructor(
        public readonly aabb: AABB,
        public readonly maxObjects: number,
        public readonly getAABB: (item: T) => AABB,
    ) {}

    /** Inserts a point into the quadtree. */
    insert(item: T): boolean {
        const itemAABB = this.getAABB(item);

        if (!this.aabb.contains(itemAABB)) {
            return false;
        }

        if (this.nodes) {
            return this.insertIntoChild(item, itemAABB) || this.insertIntoCurrentNode(item);
        }

        if (this.items.length < this.maxObjects) {
            this.items.push(item);

            return true;
        }

        this.subdivide();
        this.redistributeItems();

        return this.insertIntoChild(item, itemAABB) || this.insertIntoCurrentNode(item);
    }

    private insertIntoCurrentNode(item: T): boolean {
        this.items.push(item);

        return true;
    }

    private insertIntoChild(item: T, itemAABB: AABB): boolean {
        if (!this.nodes) {
            return false;
        }

        if (this.nodes.ne.aabb.contains(itemAABB)) return this.nodes.ne.insert(item);
        if (this.nodes.se.aabb.contains(itemAABB)) return this.nodes.se.insert(item);
        if (this.nodes.sw.aabb.contains(itemAABB)) return this.nodes.sw.insert(item);
        if (this.nodes.nw.aabb.contains(itemAABB)) return this.nodes.nw.insert(item);

        return false;
    }

    /** Subdivides the current node into four child nodes. */
    private subdivide(): void {
        const nodeWidth = this.aabb.width / 2;
        const nodeHeight = this.aabb.height / 2;

        this.nodes = {
            ne: new QuadTree(new AABB(this.aabb.center, this.aabb.max), this.maxObjects, this.getAABB),
            se: new QuadTree(
                new AABB(
                    this.aabb.center.subtract(new Vector2(0, nodeHeight)),
                    this.aabb.center.add(new Vector2(nodeWidth, 0)),
                ),
                this.maxObjects,
                this.getAABB,
            ),
            sw: new QuadTree(new AABB(this.aabb.min, this.aabb.center), this.maxObjects, this.getAABB),
            nw: new QuadTree(
                new AABB(
                    this.aabb.center.subtract(new Vector2(nodeWidth, 0)),
                    this.aabb.center.add(new Vector2(0, nodeHeight)),
                ),
                this.maxObjects,
                this.getAABB,
            ),
        };
    }

    private redistributeItems(): void {
        if (!this.nodes) {
            return;
        }

        const items = this.items;
        this.items = [];

        for (const item of items) {
            const itemAABB = this.getAABB(item);

            if (!this.insertIntoChild(item, itemAABB)) {
                this.items.push(item);
            }
        }
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
            this.nodes.ne.query(range, foundPoints);
            this.nodes.se.query(range, foundPoints);
            this.nodes.sw.query(range, foundPoints);
            this.nodes.nw.query(range, foundPoints);
        }

        return foundPoints;
    }

    /** Clears the quadtree. */
    clear(): void {
        this.items = [];
        this.nodes = null;
    }
}
