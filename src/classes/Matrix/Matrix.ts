import { getDot } from '../../utils';

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

        result.data[0][0] = Math.cos(radians);
        result.data[0][1] = -Math.sin(radians);
        result.data[1][0] = Math.sin(radians);
        result.data[1][1] = Math.cos(radians);

        return result;
    }

    public subtr(matrix: Matrix): Matrix {
        if (this.cols !== matrix.cols || this.rows !== matrix.rows) {
            throw new Error('The order of the matrices are not equal.');
        }

        const result = new Matrix(this.rows, this.rows);

        for (let iRow = 0; iRow < this.data.length; iRow++) {
            for (let iCol = 0; iCol < this.data[iRow].length; iCol++) {
                result.data[iRow][iCol] = this.data[iRow][iCol] - matrix.data[iRow][iCol];
            }
        }

        return result;
    }

    public add(matrix: Matrix): Matrix {
        if (this.cols !== matrix.cols || this.rows !== matrix.rows) {
            throw new Error('The order of the matrices are not equal.');
        }

        const result = new Matrix(this.rows, this.cols);

        for (let iRow = 0; iRow < this.data.length; iRow++) {
            for (let iCol = 0; iCol < this.data[iRow].length; iCol++) {
                result.data[iRow][iCol] = this.data[iRow][iCol] + matrix.data[iRow][iCol];
            }
        }

        return result;
    }

    public multBy(n: number): Matrix {
        const result = new Matrix(this.rows, this.cols);

        for (let iRow = 0; iRow < this.data.length; iRow++) {
            for (let iCol = 0; iCol < this.data[iRow].length; iCol++) {
                result.data[iRow][iCol] = this.data[iRow][iCol] * n;
            }
        }

        return result;
    }

    public mult(matrix: Matrix): Matrix {
        if (this.cols !== matrix.rows) {
            throw new Error(
                'The number of columns in the first matrix must be equal to the number of rows in the second matrix.',
            );
        }

        const result = new Matrix(this.rows, matrix.cols);

        for (let iRow = 0; iRow < this.rows; iRow++) {
            const currSelfRowNumbers = this.data[iRow];

            for (let iMatrixCol = 0; iMatrixCol < matrix.cols; iMatrixCol++) {
                const currMatrixColNumbers: number[] = [];

                for (let iMatrixRow = 0; iMatrixRow < matrix.rows; iMatrixRow++) {
                    currMatrixColNumbers.push(matrix.data[iMatrixRow][iMatrixCol]);
                }

                result.data[iRow][iMatrixCol] = getDot(currSelfRowNumbers, currMatrixColNumbers);
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
