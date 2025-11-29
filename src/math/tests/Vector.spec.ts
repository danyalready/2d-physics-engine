import Vector2 from '../Vector2';

describe('Vector2', () => {
    test('constructor sets x and y', () => {
        const v = new Vector2(3, 4);
        expect(v.x).toBe(3);
        expect(v.y).toBe(4);
    });

    test('zero() returns (0, 0)', () => {
        const v = Vector2.zero();
        expect(v.x).toBe(0);
        expect(v.y).toBe(0);
    });

    test('fromAngle() creates unit vector at angle', () => {
        const v = Vector2.fromAngle(Math.PI / 2);
        expect(v.x).toBeCloseTo(0);
        expect(v.y).toBeCloseTo(1);
    });

    test('getMagnitude() returns correct length', () => {
        const v = new Vector2(3, 4);
        expect(v.getMagnitude()).toBe(5);
    });

    test('getSquareMagnitude() returns squared length', () => {
        const v = new Vector2(3, 4);
        expect(v.getSquareMagnitude()).toBe(25);
    });

    test('getNormal() returns unit vector', () => {
        const v = new Vector2(10, 0);
        const n = v.getNormal();
        expect(n.x).toBe(1);
        expect(n.y).toBe(0);
    });

    test('getNormal() of zero vector returns zero vector', () => {
        const v = new Vector2(0, 0);
        const n = v.getNormal();
        expect(n.x).toBe(0);
        expect(n.y).toBe(0);
    });

    test('getTangent() returns perpendicular vector', () => {
        const v = new Vector2(2, 3);
        const t = v.getTangent();
        expect(t.x).toBe(-3);
        expect(t.y).toBe(2);
    });

    test('scale() multiplies components', () => {
        const v = new Vector2(2, 3);
        const r = v.scale(2);
        expect(r.x).toBe(4);
        expect(r.y).toBe(6);
    });

    test('add() returns component-wise sum', () => {
        const a = new Vector2(1, 2);
        const b = new Vector2(3, 4);
        const r = a.add(b);
        expect(r.x).toBe(4);
        expect(r.y).toBe(6);
    });

    test('subtract() returns component-wise difference', () => {
        const a = new Vector2(5, 5);
        const b = new Vector2(2, 3);
        const r = a.subtract(b);
        expect(r.x).toBe(3);
        expect(r.y).toBe(2);
    });

    test('addScaled() computes a + b * scalar', () => {
        const a = new Vector2(1, 1);
        const b = new Vector2(2, 3);
        const r = a.addScaled(b, 2);
        expect(r.x).toBe(1 + 4);
        expect(r.y).toBe(1 + 6);
    });

    test('dotProduct() computes scalar dot product', () => {
        const a = new Vector2(1, 2);
        const b = new Vector2(3, 4);
        expect(a.dotProduct(b)).toBe(11);
    });

    test('crossProduct() computes 2D scalar cross', () => {
        const a = new Vector2(1, 2);
        const b = new Vector2(3, 4);
        expect(a.crossProduct(b)).toBe(-2);
    });

    test('componentProduct() multiplies components', () => {
        const a = new Vector2(2, 3);
        const b = new Vector2(4, 5);
        const r = a.componentProduct(b);
        expect(r.x).toBe(8);
        expect(r.y).toBe(15);
    });

    test('rotate() rotates vector by radians', () => {
        const v = new Vector2(1, 0);
        const r = v.rotate(Math.PI / 2);
        expect(r.x).toBeCloseTo(0);
        expect(r.y).toBeCloseTo(1);
    });

    test('clone() returns an identical but different instance', () => {
        const v = new Vector2(7, 8);
        const c = v.clone();

        expect(c).not.toBe(v);
        expect(c.x).toBe(7);
        expect(c.y).toBe(8);
    });

    test('radians() returns correct angle between vectors', () => {
        const a = new Vector2(1, 0);
        const b = new Vector2(0, 1);

        const angle = a.radians(b);
        expect(angle).toBeCloseTo(Math.PI / 2);
    });

    test('radians() returns 0 for zero-length vector', () => {
        const a = new Vector2(0, 0);
        const b = new Vector2(1, 0);

        expect(a.radians(b)).toBe(0);
        expect(b.radians(a)).toBe(0);
    });

    test('radians() handles floating point errors (clamping)', () => {
        // two almost identical vectors
        const a = new Vector2(1, 0);
        const b = new Vector2(1.00000000001, 0);

        const angle = a.radians(b);
        expect(angle).toBeCloseTo(0);
    });
});
