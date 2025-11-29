export class Matrix {
    private _data: number[][];

    constructor(
        public readonly rowsCount: number,
        public readonly colsCount: number,
        fill: number = 0,
    ) {
        if (rowsCount <= 0 || colsCount <= 0) {
            throw new Error('Matrix dimensions must be positive.');
        }

        this._data = Array.from({ length: rowsCount }, () => Array.from({ length: colsCount }, () => fill));
    }

    /** ---------------- STATIC HELPERS ---------------- **/

    static isValid(matrix: number[][]): boolean {
        if (!Array.isArray(matrix) || matrix.length === 0) return false;

        const rows = matrix.length;
        const cols = matrix[0]?.length;

        if (cols === 0) return false;

        return matrix.every((row) => Array.isArray(row) && row.length === cols);
    }

    static identity(size: number): Matrix {
        const m = new Matrix(size, size);

        for (let i = 0; i < size; i++) {
            m._data[i][i] = 1;
        }
        return m;
    }

    static rotation2D(radians: number): Matrix {
        const m = new Matrix(2, 2);

        m._data[0][0] = Math.cos(radians);
        m._data[0][1] = -Math.sin(radians);
        m._data[1][0] = Math.sin(radians);
        m._data[1][1] = Math.cos(radians);

        return m;
    }

    /** ---------------- BASIC OPERATIONS ---------------- **/

    add(matrix: Matrix): Matrix {
        this._assertSameDimensions(matrix);

        const result = new Matrix(this.rowsCount, this.colsCount);

        for (let i = 0; i < this.rowsCount; i++) {
            for (let j = 0; j < this.colsCount; j++) {
                result._data[i][j] = this._data[i][j] + matrix._data[i][j];
            }
        }

        return result;
    }

    subtract(matrix: Matrix): Matrix {
        this._assertSameDimensions(matrix);

        const result = new Matrix(this.rowsCount, this.colsCount);

        for (let i = 0; i < this.rowsCount; i++) {
            for (let j = 0; j < this.colsCount; j++) {
                result._data[i][j] = this._data[i][j] - matrix._data[i][j];
            }
        }

        return result;
    }

    multiplyBy(scalar: number): Matrix {
        const result = new Matrix(this.rowsCount, this.colsCount);

        for (let i = 0; i < this.rowsCount; i++) {
            for (let j = 0; j < this.colsCount; j++) {
                result._data[i][j] = this._data[i][j] * scalar;
            }
        }

        return result;
    }

    multiply(matrix: Matrix): Matrix {
        if (this.colsCount !== matrix.rowsCount) {
            throw new Error('Invalid dimensions for matrix multiplication.');
        }

        const result = new Matrix(this.rowsCount, matrix.colsCount);

        for (let i = 0; i < this.rowsCount; i++) {
            for (let j = 0; j < matrix.colsCount; j++) {
                let sum = 0;

                for (let k = 0; k < this.colsCount; k++) {
                    sum += this._data[i][k] * matrix._data[k][j];
                }

                result._data[i][j] = sum;
            }
        }

        return result;
    }

    /** ---------------- EXTRA UTILITIES ---------------- **/

    transpose(): Matrix {
        const result = new Matrix(this.colsCount, this.rowsCount);

        for (let i = 0; i < this.rowsCount; i++) {
            for (let j = 0; j < this.colsCount; j++) {
                result._data[j][i] = this._data[i][j];
            }
        }

        return result;
    }

    clone(): Matrix {
        const m = new Matrix(this.rowsCount, this.colsCount);
        m._data = this._data.map((row) => [...row]);
        return m;
    }

    equals(matrix: Matrix, tolerance: number = 1e-9): boolean {
        if (this.rowsCount !== matrix.rowsCount || this.colsCount !== matrix.colsCount) {
            return false;
        }

        for (let i = 0; i < this.rowsCount; i++) {
            for (let j = 0; j < this.colsCount; j++) {
                if (Math.abs(this._data[i][j] - matrix._data[i][j]) > tolerance) {
                    return false;
                }
            }
        }

        return true;
    }

    /** ---------------- INTERNAL HELPERS ---------------- **/

    private _assertSameDimensions(matrix: Matrix): void {
        if (this.rowsCount !== matrix.rowsCount || this.colsCount !== matrix.colsCount) {
            throw new Error('Matrices must have the same dimensions.');
        }
    }

    /** ---------------- GETTERS / SETTERS ---------------- **/

    get data(): number[][] {
        return this._data;
    }

    set data(newData: number[][]) {
        if (!Matrix.isValid(newData)) {
            throw new Error('Invalid matrix data format.');
        }

        if (newData.length !== this.rowsCount || newData[0].length !== this.colsCount) {
            throw new Error('Matrix dimensions mismatch.');
        }

        this._data = newData.map((row) => [...row]);
    }
}
