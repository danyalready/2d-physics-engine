import Vector, { type Coordinate } from './Vector';

const FRICTION: number = 0.045;

export type PhysicObjectParams = {
    mass: number;
    elasticity: number;
    coordinate: Coordinate;
    velocity?: Vector;
    acceleration?: Vector;
    accelerationUnit?: number;
    isPlayer?: boolean;
};

class PhysicObject {
    public mass: number;
    public elasticity: number;
    public position: Vector;
    public velocity: Vector;
    public acceleration: Vector;
    public accelerationUnit: number;
    public isPlayer: boolean;

    constructor(params: PhysicObjectParams) {
        this.mass = params.mass;
        this.elasticity = params.elasticity;
        this.position = new Vector(params.coordinate);
        this.velocity = params.velocity || new Vector({ x: 0, y: 0 });
        this.acceleration = params.acceleration || new Vector({ x: 0, y: 0 });
        this.accelerationUnit = params.accelerationUnit || 1;
        this.isPlayer = Boolean(params.isPlayer);
    }

    public repositionate() {
        this.acceleration = this.acceleration.unit.mult(this.accelerationUnit);
        this.velocity = this.velocity.add(this.acceleration);
        this.velocity = this.velocity.mult(1 - FRICTION);
        this.position = this.position.add(this.velocity);
    }
}

export default PhysicObject;
