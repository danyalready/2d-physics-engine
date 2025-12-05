import { AABB } from '../AABB';
import { QuadTree } from '../QuadTree';
import { Vector2 } from '../Vector2';

describe('QuadTree<T>', () => {
    const worldAABB = new AABB(new Vector2(0, 0), new Vector2(100, 100));

    const makeAABB = (x: number, y: number) => new AABB(new Vector2(x, y), new Vector2(x, y)); // zero-size box

    type Item = { id: number; x: number; y: number };

    const getAABB = (item: Item) => makeAABB(item.x, item.y);

    test('inserts item inside world bounds', () => {
        const qt = new QuadTree<Item>(worldAABB, 4, getAABB);

        const result = qt.insert({ id: 1, x: 10, y: 10 });

        expect(result).toBe(true);
    });

    test('rejects item outside of world bounds', () => {
        const qt = new QuadTree<Item>(worldAABB, 4, getAABB);

        const result = qt.insert({ id: 1, x: 200, y: 200 });

        expect(result).toBe(false);
    });

    test('stores items until reaching maxObjects', () => {
        const qt = new QuadTree<Item>(worldAABB, 2, getAABB);

        qt.insert({ id: 1, x: 10, y: 10 });
        qt.insert({ id: 2, x: 20, y: 20 });

        // Should still be in root (no subdivision yet)
        // @ts-ignore accessing for test
        expect(qt['items'].length).toBe(2);
        // @ts-ignore
        expect(qt['nodes']).toBeNull();
    });

    test('subdivides when capacity exceeded', () => {
        const qt = new QuadTree<Item>(worldAABB, 1, getAABB);

        qt.insert({ id: 1, x: 10, y: 10 });
        qt.insert({ id: 2, x: 80, y: 10 }); // triggers subdivision

        // @ts-ignore
        expect(qt['nodes']).not.toBeNull();
        // @ts-ignore
        expect(qt['items'].length).toBe(1); // root keeps one item
    });

    test('inserts items into correct quadrant', () => {
        const qt = new QuadTree<Item>(worldAABB, 1, getAABB);

        qt.insert({ id: 2, x: 80, y: 10 }); // SE
        qt.insert({ id: 1, x: 10, y: 10 }); // SW
        qt.insert({ id: 3, x: 30, y: 70 }); // NW
        qt.insert({ id: 4, x: 80, y: 90 }); // NE

        // @ts-ignore
        const nodes = qt['nodes'];
        expect(nodes).not.toBeNull();

        // @ts-ignore
        const SW = nodes.get('SW');
        // @ts-ignore
        const NW = nodes.get('NW');
        // @ts-ignore
        const NE = nodes.get('NE');

        expect(qt['items'].length).toBe(1);
        expect(SW!['items'].length).toBe(1);
        expect(NW!['items'].length).toBe(1);
        expect(NE!['items'].length).toBe(1);
    });

    test('query returns items inside range', () => {
        const qt = new QuadTree<Item>(worldAABB, 2, getAABB);

        qt.insert({ id: 1, x: 10, y: 10 });
        qt.insert({ id: 2, x: 80, y: 80 });
        qt.insert({ id: 3, x: 50, y: 50 });

        const range = new AABB(new Vector2(0, 0), new Vector2(60, 60));
        const found = qt.query(range);

        const ids = found.map((i) => i.id).sort();

        expect(ids).toEqual([1, 3]);
    });

    test('query returns empty when no items intersect', () => {
        const qt = new QuadTree<Item>(worldAABB, 4, getAABB);

        qt.insert({ id: 1, x: 10, y: 10 });
        qt.insert({ id: 2, x: 20, y: 20 });

        const range = new AABB(new Vector2(80, 80), new Vector2(90, 90));
        const found = qt.query(range);

        expect(found.length).toBe(0);
    });

    test('clear removes all items and nodes', () => {
        const qt = new QuadTree<Item>(worldAABB, 1, getAABB);

        qt.insert({ id: 1, x: 10, y: 10 });
        qt.insert({ id: 2, x: 80, y: 10 }); // subdivides

        qt.clear();

        // @ts-ignore
        expect(qt['items'].length).toBe(0);
        // @ts-ignore
        expect(qt['nodes']).toBeNull();
    });

    test('getAABB is called for inserted items', () => {
        const mockGetAABB = jest.fn(getAABB);

        const qt = new QuadTree<Item>(worldAABB, 4, mockGetAABB);

        qt.insert({ id: 99, x: 5, y: 5 });

        expect(mockGetAABB).toHaveBeenCalledTimes(1);
    });

    test('query works on subdivided trees', () => {
        const qt = new QuadTree<Item>(worldAABB, 1, getAABB);

        qt.insert({ id: 1, x: 10, y: 10 }); // SW
        qt.insert({ id: 2, x: 80, y: 10 }); // SE
        qt.insert({ id: 3, x: 80, y: 80 }); // NE

        const range = new AABB(new Vector2(70, 0), new Vector2(100, 50)); // covers SE

        const found = qt.query(range).map((i) => i.id);

        expect(found).toContain(2);
        expect(found).not.toContain(1);
        expect(found).not.toContain(3);
    });
});
