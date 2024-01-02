import Vector, { type Coordinate } from './Vector';

export type PhysicalObjectParams = {
    coordinate: Coordinate;

    mass?: number;
    friction?: number;
    elasticity?: number;
    velocity?: Vector;
    acceleration?: Vector;
    accelerationUnit?: number;
    isPlayer?: boolean;
};

class PhysicalObject {
    public mass: number;
    public friction: number;
    public elasticity: number;
    public position: Vector;
    public velocity: Vector;
    public acceleration: Vector;
    public accelerationUnit: number;
    public isPlayer: boolean;

    constructor(params: PhysicalObjectParams) {
        this.mass = params.mass || 0;
        this.friction = params.friction || 0;
        this.elasticity = params.elasticity || 1;
        this.position = new Vector(params.coordinate);
        this.velocity = params.velocity || new Vector({ x: 0, y: 0 });
        this.acceleration = params.acceleration || new Vector({ x: 0, y: 0 });
        this.accelerationUnit = params.accelerationUnit || 1;
        this.isPlayer = Boolean(params.isPlayer);
    }

    public repositionate() {
        this.acceleration = this.acceleration.unit.mult(this.accelerationUnit);
        this.velocity = this.velocity.add(this.acceleration);
        this.velocity = this.velocity.mult(1 - this.friction);
        this.position = this.position.add(this.velocity);
    }
}

export default PhysicalObject;
