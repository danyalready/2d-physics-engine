import Matrix from './Matrix';

describe('Matrix class:', () => {
    describe('static methods:', () => {
        test('`isValid`', () => {
            const validMatrixData = [
                [[1]],
                [[1, 2]],
                [
                    [1, 2],
                    [3, 4],
                ],
                [
                    [1, 2, 3],
                    [4, 5, 6],
                ],
                [
                    [1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 9],
                ],
                [
                    [1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 9],
                    [10, 11, 12],
                ],
            ];
            const invalidMatrixData = [
                [[], []],
                [[1, 2], [3]],
                [
                    [1, 2, 3],
                    [4, 5],
                    [6, 7, 8, 9],
                ],
            ];

            for (const matrixData of validMatrixData) {
                expect(Matrix.isValid(matrixData)).toBeTruthy();
            }

            for (const matrixData of invalidMatrixData) {
                expect(Matrix.isValid(matrixData)).toBeFalsy();
            }
        });

        test('`getRotationMatrix`', () => {
            const rotationMatrix = Matrix.getRotationMatrix(Math.PI);

            // TODO: should be replaced with an another approach
            expect(rotationMatrix.data).toMatchObject([
                [-1, -1.2246467991473532e-16],
                [1.2246467991473532e-16, -1],
            ]);
        });
    });

    describe('public methods:', () => {
        test('`add`', () => {
            const matrixA = new Matrix(2, 2);
            const matrixB = new Matrix(2, 2);

            matrixA.data = [
                [1, 2],
                [3, 4],
            ];
            matrixB.data = [
                [5, 6],
                [7, 8],
            ];

            expect(matrixA.add(matrixB).data).toMatchObject([
                [6, 8],
                [10, 12],
            ]);
        });

        test('`subtr`', () => {
            const matrixA = new Matrix(2, 2);
            const matrixB = new Matrix(2, 2);

            matrixA.data = [
                [1, 2],
                [3, 4],
            ];
            matrixB.data = [
                [5, 6],
                [7, 8],
            ];

            expect(matrixB.subtr(matrixA).data).toMatchObject([
                [4, 4],
                [4, 4],
            ]);
        });

        test('`multBy`', () => {
            const matrixA = new Matrix(2, 2);

            matrixA.data = [
                [1, 2],
                [3, 4],
            ];

            expect(matrixA.multBy(2).data).toMatchObject([
                [2, 4],
                [6, 8],
            ]);
        });

        test('`mult`', () => {
            const matrixA = new Matrix(2, 3);
            const matrixB = new Matrix(3, 2);

            matrixA.data = [
                [1, 2, 3],
                [4, 5, 6],
            ];
            matrixB.data = [
                [1, 2],
                [3, 4],
                [5, 6],
            ];

            expect(matrixA.mult(matrixB).data).toMatchObject([
                [22, 28],
                [49, 64],
            ]);
        });
    });
});
