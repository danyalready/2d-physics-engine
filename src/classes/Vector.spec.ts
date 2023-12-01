import Vector from './Vector';

const vectors = [
    new Vector({ x: 4, y: 0 }),
    new Vector({ x: 0, y: 11 }),
    new Vector({ x: 7, y: 0 }),
    new Vector({ x: 1, y: 1 }),
    new Vector({ x: 3, y: 3 }),
    new Vector({ x: -7, y: -3 }),
    new Vector({ x: -13, y: 70 }),
];

describe('Vector class:', () => {
    test('unit value', () => {
        for (const vector of vectors) {
            expect(vector.unit.magnitude).toBeCloseTo(1);
        }
    });

    test('normal value', () => {
        for (const vector of vectors) {
            expect(vector.normal).toMatchObject({ x: -vector.y, y: vector.x });
        }
    });

    test('magnitude value', () => {
        for (const vector of vectors) {
            expect(vector.magnitude).toBeCloseTo(Math.sqrt(vector.x ** 2 + vector.y ** 2));
        }
    });
});
