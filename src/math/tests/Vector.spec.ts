import { Vector2D } from '../Vector2D';

describe('Vector class:', () => {
    describe('values:', () => {
        const vectors = [
            new Vector2D(4, 0),
            new Vector2D(0, 11),
            new Vector2D(7, 0),
            new Vector2D(1, 1),
            new Vector2D(3, 3),
            new Vector2D(-7, -3),
            new Vector2D(-13, 70),
        ];

        test('`normal`', () => {
            for (const vector of vectors) {
                expect(vector.tangent).toMatchObject({ x: -vector.y, y: vector.x });
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
        const v1 = new Vector2D(4, 2);
        const v2 = new Vector2D(2, 4);

        test('`getDot` - static method', () => {
            expect(v1.getDot(v2)).toBe(v1.x * v2.x + v1.y * v2.y);
        });

        test('`getRadians` - static method', () => {
            const v1 = new Vector2D(1, 0);
            const v2 = new Vector2D(1, 1);

            const angle = (v1.getRadians(v2) * 180) / Math.PI;

            expect(angle).toBeCloseTo(45);
        });

        test('`add` - public method', () => {
            expect(v1.add(v2)).toMatchObject({ x: 6, y: 6 });
        });

        test('`subtr` - public method', () => {
            expect(v1.subtract(v2)).toMatchObject({ x: 2, y: -2 });
        });

        test('`scale` - public method', () => {
            expect(v1.scale(2)).toMatchObject({ x: 8, y: 4 });
        });
    });
});
