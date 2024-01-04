class Matrix {
    public rows: number;
    public cols: number;
    public data: Array<number[]>;

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
        this.data = [];

        for (let iRow = 0; iRow < rows; iRow++) {
            const row: number[] = [];

            for (let iCol = 0; iCol < cols; iCol++) {
                row.push(0);
            }

            this.data.push(row);
        }
    }

    static getRotationMatrix(radians: number): Matrix {
        const result = new Matrix(2, 2);

        result.data[0][0] = Math.cos(radians);
        result.data[0][1] = -Math.sin(radians);
        result.data[1][0] = Math.sin(radians);
        result.data[1][1] = Math.cos(radians);

        return result;
    }
}

export default Matrix;
