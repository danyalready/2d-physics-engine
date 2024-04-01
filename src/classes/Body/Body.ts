import Vector, { type Coordinate } from '../Vector/Vector';

export type BodyParams = {
    coordinate: Coordinate;

    mass?: number;
    friction?: number;
    elasticity?: number;
    linVelocity?: Vector;
    linAcceleration?: Vector;
    linAccelerationUnit?: number;
    angle?: number;
    angVelocity?: number;
    angAcceleration?: number;
    angAccelerationUnit?: number;
    isPlayer?: boolean;
};

class Body {
    public mass: number;
    public friction: number;
    public elasticity: number;
    public position: Vector;
    public linVelocity: Vector;
    public linAcceleration: Vector;
    public linAccelerationUnit: number;
    public angle: number;
    public angVelocity: number;
    public angAcceleration: number;
    public angAccelerationUnit: number;
    public isPlayer: boolean;

    constructor(params: BodyParams) {
        this.mass = params.mass || 0;
        this.friction = params.friction || 0;
        this.elasticity = params.elasticity || 1;
        this.position = new Vector(params.coordinate);
        this.linVelocity = params.linVelocity || new Vector({ x: 0, y: 0 });
        this.linAcceleration = params.linAcceleration || new Vector({ x: 0, y: 0 });
        this.linAccelerationUnit = params.linAccelerationUnit || 1;
        this.angle = params.angle || 0;
        this.angVelocity = params.angVelocity || 0;
        this.angAcceleration = params.angAcceleration || 0;
        this.angAccelerationUnit = params.angAccelerationUnit || 1;
        this.isPlayer = Boolean(params.isPlayer);
    }

    public repositionate() {
        this.linAcceleration = this.linAcceleration.unit.mult(this.linAccelerationUnit);
        this.linVelocity = this.linVelocity.add(this.linAcceleration);
        this.linVelocity = this.linVelocity.mult(1 - this.friction);

        this.angAcceleration *= this.angAccelerationUnit;
        this.angVelocity += this.angAcceleration;
        this.angVelocity *= 1 - this.friction;

        this.position = this.position.add(this.linVelocity);
    }

    public getClosestPointTo(_vector: Vector): Vector {
        return this.position;
    }
}

export default Body;
