import Vector2 from '../Vector2';
import { AABB } from '../AABB';

describe('AABB', () => {
    /** ---------------- CONSTRUCTOR & NORMALIZATION ---------------- **/
    test('constructor normalizes min and max', () => {
        const aabb = new AABB(new Vector2(10, 20), new Vector2(0, 5));
        expect(aabb.min.x).toBe(0);
        expect(aabb.min.y).toBe(5);
        expect(aabb.max.x).toBe(10);
        expect(aabb.max.y).toBe(20);
    });

    test('fromCenter factory creates correct AABB', () => {
        const center = new Vector2(5, 5);
        const halfSize = new Vector2(2, 3);
        const aabb = AABB.fromCenter(center, halfSize);
        expect(aabb.min).toEqual(new Vector2(3, 2));
        expect(aabb.max).toEqual(new Vector2(7, 8));
    });

    test('fromMinSize factory creates correct AABB', () => {
        const min = new Vector2(1, 1);
        const width = 4;
        const height = 5;
        const aabb = AABB.fromMinSize(min, width, height);
        expect(aabb.min).toEqual(min);
        expect(aabb.max).toEqual(new Vector2(5, 6));
    });

    /** ---------------- GETTERS ---------------- **/
    const aabb = new AABB(new Vector2(1, 2), new Vector2(4, 6));

    test('width and height getters', () => {
        expect(aabb.width).toBe(3);
        expect(aabb.height).toBe(4);
        expect(aabb.size).toEqual(new Vector2(3, 4));
    });

    test('center getter', () => {
        expect(aabb.center).toEqual(new Vector2(2.5, 4));
    });

    test('area, perimeter, diagonal, isEmpty', () => {
        expect(aabb.area).toBe(12);
        expect(aabb.perimeter).toBe(14);
        expect(aabb.diagonal).toBeCloseTo(5);
        expect(aabb.isEmpty).toBe(false);

        const emptyAABB = new AABB(new Vector2(0, 0), new Vector2(0, 5));
        expect(emptyAABB.isEmpty).toBe(true);
    });

    /** ---------------- MOVEMENT & EXPANSION ---------------- **/
    test('move returns new AABB with offset', () => {
        const moved = aabb.move(new Vector2(1, -1));
        expect(moved.min).toEqual(new Vector2(2, 1));
        expect(moved.max).toEqual(new Vector2(5, 5));
    });

    test('expand returns new AABB expanded by margin', () => {
        const expanded = aabb.expand(2);
        expect(expanded.min).toEqual(new Vector2(-1, 0));
        expect(expanded.max).toEqual(new Vector2(6, 8));
    });

    /** ---------------- CONTAINMENT ---------------- **/
    test('containsPoint inclusive', () => {
        expect(aabb.containsPoint(new Vector2(1, 2))).toBe(true);
        expect(aabb.containsPoint(new Vector2(4, 6))).toBe(true);
        expect(aabb.containsPoint(new Vector2(2.5, 4))).toBe(true);
        expect(aabb.containsPoint(new Vector2(0, 0))).toBe(false);
        expect(aabb.containsPoint(new Vector2(5, 7))).toBe(false);
    });

    test('containsPoint exclusive', () => {
        expect(aabb.containsPoint(new Vector2(1, 2), false)).toBe(false);
        expect(aabb.containsPoint(new Vector2(4, 6), false)).toBe(false);
        expect(aabb.containsPoint(new Vector2(2.5, 4), false)).toBe(true);
    });

    test('contains AABB inclusive', () => {
        const inner = new AABB(new Vector2(2, 3), new Vector2(3, 5));
        expect(aabb.contains(inner)).toBe(true);
        const outside = new AABB(new Vector2(0, 0), new Vector2(3, 4));
        expect(aabb.contains(outside)).toBe(false);
    });

    test('contains AABB exclusive', () => {
        const touching = new AABB(new Vector2(1, 2), new Vector2(4, 6));
        expect(aabb.contains(touching, false)).toBe(false);
    });

    /** ---------------- INTERSECTION ---------------- **/
    test('intersects inclusive', () => {
        const other = new AABB(new Vector2(3, 5), new Vector2(5, 7));
        expect(aabb.intersects(other)).toBe(true);

        const disjoint = new AABB(new Vector2(5, 7), new Vector2(6, 8));
        expect(aabb.intersects(disjoint)).toBe(false);
    });

    test('intersects exclusive', () => {
        const touching = new AABB(new Vector2(4, 6), new Vector2(5, 7));
        expect(aabb.intersects(touching, false)).toBe(false);
    });

    test('intersection returns correct AABB', () => {
        const other = new AABB(new Vector2(2, 3), new Vector2(5, 7));
        const inter = aabb.intersection(other);
        expect(inter).not.toBeNull();
        expect(inter!.min).toEqual(new Vector2(2, 3));
        expect(inter!.max).toEqual(new Vector2(4, 6));

        const disjoint = new AABB(new Vector2(5, 6), new Vector2(7, 8));
        expect(aabb.intersection(disjoint)).toBeNull();
    });

    /** ---------------- UNION ---------------- **/
    test('union returns AABB containing both', () => {
        const other = new AABB(new Vector2(-1, 3), new Vector2(3, 7));
        const unioned = aabb.union(other);
        expect(unioned.min).toEqual(new Vector2(-1, 2));
        expect(unioned.max).toEqual(new Vector2(4, 7));
    });

    /** ---------------- CLONE ---------------- **/
    test('clone returns identical but new instance', () => {
        const clone = aabb.clone();
        expect(clone).not.toBe(aabb);
        expect(clone.min).toEqual(aabb.min);
        expect(clone.max).toEqual(aabb.max);
    });
});
