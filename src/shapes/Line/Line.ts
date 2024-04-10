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

    public getClossestPoints(line: Line): [Vector, Vector] {
        const [thisStart, thisEnd] = this.positions;
        const [lineStart, lineEnd] = line.positions;

        let clossestPoints: [Vector, Vector] = [thisStart, line.getClossestPoint(thisStart)];
        let shortestDistance: number = clossestPoints[0].subtr(clossestPoints[1]).magnitude;

        function updateShortestDistance() {
            shortestDistance = clossestPoints[0].subtr(clossestPoints[1]).magnitude;
        }

        if (line.getClossestPoint(thisEnd).subtr(thisEnd).magnitude < shortestDistance) {
            clossestPoints = [thisEnd, line.getClossestPoint(thisEnd)];
            updateShortestDistance();
        }

        if (this.getClossestPoint(lineStart).subtr(lineStart).magnitude < shortestDistance) {
            clossestPoints = [this.getClossestPoint(lineStart), lineStart];
            updateShortestDistance();
        }

        if (this.getClossestPoint(lineEnd).subtr(lineEnd).magnitude < shortestDistance) {
            clossestPoints = [this.getClossestPoint(lineEnd), lineEnd];
            updateShortestDistance();
        }

        return clossestPoints;
    }

    public get unit(): Vector {
        return this.positions[1].subtr(this.positions[0]).unit;
    }
}

export default Line;
