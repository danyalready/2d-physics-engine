import { Vector } from '../../classes';

type LineParams = {
    positions: [Vector, Vector];
};

class Line {
    //** Position start and position end. */
    public positions: [Vector, Vector];

    constructor(params: LineParams) {
        this.positions = params.positions;
    }

    public getClossestPoint(vector: Vector): Vector {
        const vectorToPositionStart = this.positions[0].subtr(vector);
        const positionEndToVector = vector.subtr(this.positions[1]);

        if (Vector.getDot(this.unit, vectorToPositionStart) > 0) {
            return this.positions[0];
        }

        if (Vector.getDot(this.unit, positionEndToVector) > 0) {
            return this.positions[1];
        }

        const scalar = Vector.getDot(this.unit, vectorToPositionStart);
        const scalarVector = this.unit.mult(scalar);

        return this.positions[0].subtr(scalarVector);
    }

    static getClossestPoints(lineA: Line, lineB: Line): [Vector, Vector] {
        const [lineAStart, lineAEnd] = lineA.positions;
        const [lineBStart, lineBEnd] = lineB.positions;

        let clossestPoints: [Vector, Vector] = [lineAStart, lineB.getClossestPoint(lineAStart)];
        let shortestDistance: number = clossestPoints[0].subtr(clossestPoints[1]).magnitude;

        function updateShortestDistance() {
            shortestDistance = clossestPoints[0].subtr(clossestPoints[1]).magnitude;
        }

        if (lineB.getClossestPoint(lineAEnd).subtr(lineAEnd).magnitude < shortestDistance) {
            clossestPoints = [lineAEnd, lineB.getClossestPoint(lineAEnd)];
            updateShortestDistance();
        }

        if (lineA.getClossestPoint(lineBStart).subtr(lineBStart).magnitude < shortestDistance) {
            clossestPoints = [lineA.getClossestPoint(lineBStart), lineBStart];
            updateShortestDistance();
        }

        if (lineA.getClossestPoint(lineBEnd).subtr(lineBEnd).magnitude < shortestDistance) {
            clossestPoints = [lineA.getClossestPoint(lineBEnd), lineBEnd];
            updateShortestDistance();
        }

        return clossestPoints;
    }

    public get unit(): Vector {
        return this.positions[1].subtr(this.positions[0]).unit;
    }
}

export default Line;
