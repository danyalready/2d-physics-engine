import Vector from './Vector';

describe('Vector class:', () => {
    test('unit value', () => {
        const vectors = [
            new Vector({ x: 4, y: 0 }),
            new Vector({ x: 0, y: 11 }),
            new Vector({ x: 7, y: 0 }),
            new Vector({ x: 1, y: 1 }),
            new Vector({ x: 3, y: 3 }),
        ];

        for (const vector of vectors) {
            expect(vector.unit.magnitude).toBeCloseTo(1);
        }
    });
});
