import { getDot } from '../uitls';

export class Matrix {
    private _data: number[][];

    constructor(
        public readonly rowsCount: number,
        public readonly colsCount: number,
    ) {
        this._data = [];

        for (let iRow = 0; iRow < rowsCount; iRow++) {
            const row: number[] = [];

            for (let iCol = 0; iCol < colsCount; iCol++) row.push(0);

            this._data.push(row);
        }
    }

    static isValid(matrix: number[][]): boolean {
        const matrixRows = matrix.length;
        const matrixCols = matrix[0].length;

        if (!matrixRows || !matrixCols) {
            return false;
        }

        return matrix.every((row) => row.length === matrixCols);
    }

    static getRotationMatrix(radians: number): Matrix {
        const result = new Matrix(2, 2);

        result.data[0][0] = Math.cos(radians);
        result.data[0][1] = -Math.sin(radians);
        result.data[1][0] = Math.sin(radians);
        result.data[1][1] = Math.cos(radians);

        return result;
    }

    public subtract(matrix: Matrix): Matrix {
        if (this.colsCount !== matrix.colsCount || this.rowsCount !== matrix.rowsCount) {
            throw new Error('The order of the matrices are not equal.');
        }

        const result = new Matrix(this.rowsCount, this.rowsCount);

        for (let iRow = 0; iRow < this.data.length; iRow++) {
            for (let iCol = 0; iCol < this.data[iRow].length; iCol++) {
                result.data[iRow][iCol] = this.data[iRow][iCol] - matrix.data[iRow][iCol];
            }
        }

        return result;
    }

    public add(matrix: Matrix): Matrix {
        if (this.colsCount !== matrix.colsCount || this.rowsCount !== matrix.rowsCount) {
            throw new Error('The order of the matrices are not equal.');
        }

        const result = new Matrix(this.rowsCount, this.colsCount);

        for (let iRow = 0; iRow < this.data.length; iRow++) {
            for (let iCol = 0; iCol < this.data[iRow].length; iCol++) {
                result.data[iRow][iCol] = this.data[iRow][iCol] + matrix.data[iRow][iCol];
            }
        }

        return result;
    }

    public multiplyBy(n: number): Matrix {
        const result = new Matrix(this.rowsCount, this.colsCount);

        for (let iRow = 0; iRow < this.data.length; iRow++) {
            for (let iCol = 0; iCol < this.data[iRow].length; iCol++) {
                result.data[iRow][iCol] = this.data[iRow][iCol] * n;
            }
        }

        return result;
    }

    public multiply(matrix: Matrix): Matrix {
        if (this.colsCount !== matrix.rowsCount) {
            throw new Error('The number of columns in the first matrix must be equal to the number of rows in the second matrix.');
        }

        const result = new Matrix(this.rowsCount, matrix.colsCount);

        for (let iRow = 0; iRow < this.rowsCount; iRow++) {
            const currSelfRowNumbers = this.data[iRow];

            for (let iMatrixCol = 0; iMatrixCol < matrix.colsCount; iMatrixCol++) {
                const currMatrixColNumbers: number[] = [];

                for (let iMatrixRow = 0; iMatrixRow < matrix.rowsCount; iMatrixRow++) {
                    currMatrixColNumbers.push(matrix.data[iMatrixRow][iMatrixCol]);
                }

                result.data[iRow][iMatrixCol] = getDot(currSelfRowNumbers, currMatrixColNumbers);
            }
        }

        return result;
    }

    public get data(): number[][] {
        return this._data;
    }

    public set data(matrixData: number[][]) {
        if (!Matrix.isValid(matrixData)) {
            throw new Error('The given matrix is not valid.');
        }

        if (matrixData.length !== this.rowsCount) {
            throw new Error('The given matrix data does not have the same amount of rows.');
        }

        if (matrixData[0].length !== this.colsCount) {
            throw new Error('The given matrix data does not have the same amount of columns.');
        }

        this._data = matrixData;
    }
}
