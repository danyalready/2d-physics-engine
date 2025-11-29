import { Matrix } from '../Matrix';

describe('Matrix', () => {
    describe('constructor', () => {
        it('creates a matrix with correct dimensions filled with zeros', () => {
            const m = new Matrix(2, 3);
            expect(m.rowsCount).toBe(2);
            expect(m.colsCount).toBe(3);

            expect(m.data).toEqual([
                [0, 0, 0],
                [0, 0, 0],
            ]);
        });

        it('throws for non-positive dimensions', () => {
            expect(() => new Matrix(0, 3)).toThrow();
            expect(() => new Matrix(3, 0)).toThrow();
        });
    });

    describe('static isValid', () => {
        it('validates correct matrices', () => {
            expect(
                Matrix.isValid([
                    [1, 2],
                    [3, 4],
                ]),
            ).toBe(true);
        });

        it('rejects jagged arrays', () => {
            expect(Matrix.isValid([[1, 2], [3]])).toBe(false);
        });

        it('rejects empty matrix', () => {
            expect(Matrix.isValid([])).toBe(false);
        });

        it('rejects matrix with empty rows', () => {
            expect(Matrix.isValid([[]])).toBe(false);
        });
    });

    describe('static identity', () => {
        it('creates an identity matrix', () => {
            const m = Matrix.identity(3);
            expect(m.data).toEqual([
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
            ]);
        });
    });

    describe('static rotation2D', () => {
        it('creates a proper rotation matrix', () => {
            const angle = Math.PI / 2;
            const m = Matrix.rotation2D(angle);

            expect(m.data[0][0]).toBeCloseTo(0);
            expect(m.data[0][1]).toBeCloseTo(-1);
            expect(m.data[1][0]).toBeCloseTo(1);
            expect(m.data[1][1]).toBeCloseTo(0);
        });
    });

    describe('add', () => {
        it('adds two matrices', () => {
            const a = new Matrix(2, 2);
            a.data = [
                [1, 2],
                [3, 4],
            ];

            const b = new Matrix(2, 2);
            b.data = [
                [5, 6],
                [7, 8],
            ];

            expect(a.add(b).data).toEqual([
                [6, 8],
                [10, 12],
            ]);
        });

        it('throws for mismatched dimensions', () => {
            const a = new Matrix(2, 2);
            const b = new Matrix(3, 2);
            expect(() => a.add(b)).toThrow();
        });
    });

    describe('subtract', () => {
        it('subtracts two matrices', () => {
            const a = new Matrix(2, 2);
            a.data = [
                [5, 5],
                [5, 5],
            ];

            const b = new Matrix(2, 2);
            b.data = [
                [1, 2],
                [3, 4],
            ];

            expect(a.subtract(b).data).toEqual([
                [4, 3],
                [2, 1],
            ]);
        });
    });

    describe('multiplyBy', () => {
        it('multiplies by scalar', () => {
            const a = new Matrix(2, 2);
            a.data = [
                [1, 2],
                [3, 4],
            ];
            const result = a.multiplyBy(2);

            expect(result.data).toEqual([
                [2, 4],
                [6, 8],
            ]);
        });
    });

    describe('multiply matrices', () => {
        it('multiplies matrices correctly', () => {
            const a = new Matrix(2, 3);
            a.data = [
                [1, 2, 3],
                [4, 5, 6],
            ];

            const b = new Matrix(3, 2);
            b.data = [
                [7, 8],
                [9, 10],
                [11, 12],
            ];

            const result = a.multiply(b);

            expect(result.data).toEqual([
                [58, 64],
                [139, 154],
            ]);
        });

        it('throws for mismatched dimensions', () => {
            const a = new Matrix(2, 2);
            const b = new Matrix(3, 3);
            expect(() => a.multiply(b)).toThrow();
        });
    });

    describe('transpose', () => {
        it('transposes matrix correctly', () => {
            const a = new Matrix(2, 3);
            a.data = [
                [1, 2, 3],
                [4, 5, 6],
            ];

            expect(a.transpose().data).toEqual([
                [1, 4],
                [2, 5],
                [3, 6],
            ]);
        });
    });

    describe('clone', () => {
        it('makes a deep clone', () => {
            const a = new Matrix(2, 2);
            a.data = [
                [1, 2],
                [3, 4],
            ];

            const c = a.clone();

            expect(c.data).toEqual(a.data);
            expect(c.data).not.toBe(a.data); // different reference
        });
    });

    describe('equals', () => {
        it('returns true for equal matrices', () => {
            const a = new Matrix(2, 2);
            a.data = [
                [1, 2],
                [3, 4],
            ];

            const b = new Matrix(2, 2);
            b.data = [
                [1, 2],
                [3, 4],
            ];

            expect(a.equals(b)).toBe(true);
        });

        it('returns false for different values', () => {
            const a = new Matrix(2, 2);
            a.data = [
                [1, 2],
                [3, 4],
            ];

            const b = new Matrix(2, 2);
            b.data = [
                [1, 2],
                [3, 5],
            ];

            expect(a.equals(b)).toBe(false);
        });
    });

    describe('data setter', () => {
        it('sets data correctly with deep copy', () => {
            const a = new Matrix(2, 2);
            const newData = [
                [7, 7],
                [7, 7],
            ];

            a.data = newData;

            expect(a.data).toEqual(newData);
            expect(a.data).not.toBe(newData);
        });

        it('throws for invalid data', () => {
            const a = new Matrix(2, 2);
            expect(() => (a.data = [[1, 2, 3]])).toThrow();
        });
    });
});
