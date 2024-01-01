import Vector from './Vector';

describe('Vector class:', () => {
    describe('values:', () => {
        const vectors = [
            new Vector({ x: 4, y: 0 }),
            new Vector({ x: 0, y: 11 }),
            new Vector({ x: 7, y: 0 }),
            new Vector({ x: 1, y: 1 }),
            new Vector({ x: 3, y: 3 }),
            new Vector({ x: -7, y: -3 }),
            new Vector({ x: -13, y: 70 }),
        ];

        test('`normal`', () => {
            for (const vector of vectors) {
                expect(vector.normal).toMatchObject({ x: -vector.y, y: vector.x });
            }
        });

        test('`magnitude`', () => {
            for (const vector of vectors) {
                expect(vector.magnitude).toBeCloseTo(Math.sqrt(vector.x ** 2 + vector.y ** 2));
            }
        });

        test('`unit`', () => {
            for (const vector of vectors) {
                expect(vector.unit.magnitude).toBeCloseTo(1);
            }
        });
    });

    describe('methods:', () => {
        const vector1 = new Vector({ x: 4, y: 2 });
        const vector2 = new Vector({ x: 2, y: 4 });

        test('`getDot` - static method', () => {
            expect(Vector.getDot(vector1, vector2)).toBe(vector1.x * vector2.x + vector1.y * vector2.y);
        });

        test('`getRadians` - static method', () => {
            const v1 = new Vector({ x: 1, y: 0 });
            const v2 = new Vector({ x: 1, y: 1 });

            const angle = (Vector.getRadians(v1, v2) * 180) / Math.PI;

            expect(angle).toBeCloseTo(45);
        });

        test('`add` - public method', () => {
            expect(vector1.add(vector2)).toMatchObject({ x: 6, y: 6 });
        });

        test('`subtr` - public method', () => {
            expect(vector1.subtr(vector2)).toMatchObject({ x: 2, y: -2 });
        });

        test('`mult` - public method', () => {
            expect(vector1.mult(2)).toMatchObject({ x: 8, y: 4 });
        });
    });
});
