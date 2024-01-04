import { getDot } from '../utils';

class Matrix {
    public readonly rows: number;
    public readonly cols: number;
    private _data: Array<number[]>;

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
        this._data = [];

        for (let iRow = 0; iRow < rows; iRow++) {
            const row: number[] = [];

            for (let iCol = 0; iCol < cols; iCol++) {
                row.push(0);
            }

            this._data.push(row);
        }
    }

    static isValid(matrixData: Array<number[]>): boolean {
        const matrixRows = matrixData.length;
        const matrixCols = matrixData[0].length;

        if (!matrixRows || !matrixCols) {
            return false;
        }

        return matrixData.every((row) => row.length === matrixCols);
    }

    static getRotationMatrix(radians: number): Matrix {
        const result = new Matrix(2, 2);

        result._data[0][0] = Math.cos(radians);
        result._data[0][1] = -Math.sin(radians);
        result._data[1][0] = Math.sin(radians);
        result._data[1][1] = Math.cos(radians);

        return result;
    }

    static multiply(matrixA: Matrix, matrixB: Matrix): Matrix {
        if (matrixA.cols !== matrixB.rows) {
            throw new Error(
                'The number of columns in the first matrix must be equal to the number of rows in the second matrix.',
            );
        }

        const result = new Matrix(matrixA.rows, matrixB.cols);

        for (let iMatrixARow = 0; iMatrixARow < matrixA.rows; iMatrixARow++) {
            const currMatrixARowNumbers = matrixA._data[iMatrixARow];

            for (let iMatrixBCol = 0; iMatrixBCol < matrixB.cols; iMatrixBCol++) {
                const currMatrixBColNumbers: number[] = [];

                for (let iMatrixBRow = 0; iMatrixBRow < matrixB.rows; iMatrixBRow++) {
                    currMatrixBColNumbers.push(matrixB._data[iMatrixBRow][iMatrixBCol]);
                }

                result._data[iMatrixARow][iMatrixBCol] = getDot(currMatrixARowNumbers, currMatrixBColNumbers);
            }
        }

        return result;
    }

    public get data(): Array<number[]> {
        return this._data;
    }

    public set data(matrixData: Array<number[]>) {
        if (!Matrix.isValid(matrixData)) {
            throw new Error('The given matrix is not valid.');
        }

        if (matrixData.length !== this.rows) {
            throw new Error('The given matrix data does not have the same amount of rows.');
        }

        if (matrixData[0].length !== this.cols) {
            throw new Error('The given matrix data does not have the same amount of columns.');
        }

        this._data = matrixData;
    }
}

export default Matrix;
