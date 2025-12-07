import { Vector2 } from '../math/Vector2';
import { Component } from './Component.abstract';

interface RigidbodyOptions {
    mass?: number;
    restitution?: number;
    friction?: number;
}

export class Rigidbody extends Component {
    readonly componentId = Symbol('Rigidbody');

    private velocity = new Vector2();
    private angularVelocity = 0;
    private forces = new Vector2();
    private torque = 0;
    private mass = 1;
    private inertia = this.mass * 0.5;
    private restitution = 1;
    private friction = 0.1;

    constructor(options?: RigidbodyOptions) {
        super();
        this.mass = options?.mass ?? this.mass;
        this.restitution = options?.restitution ?? this.restitution;
        this.friction = options?.friction ?? this.friction;
    }

    update(): void {}

    // Getters and setters for state
    getVelocity(): Vector2 {
        return this.velocity.clone();
    }

    setVelocity(velocity: Vector2): void {
        this.velocity = velocity.clone();
    }

    getAngularVelocity(): number {
        return this.angularVelocity;
    }

    setAngularVelocity(angularVelocity: number): void {
        this.angularVelocity = angularVelocity;
    }

    getMass(): number {
        return this.mass;
    }

    getInverseMass(): number {
        return this.mass > 0 ? 1 / this.mass : 0;
    }

    getInertia(): number {
        return this.inertia;
    }

    // Force accumulation
    getAccumulatedForces(): Vector2 {
        return this.forces.clone();
    }

    getTorque(): number {
        return this.torque;
    }

    addForce(force: Vector2): void {
        this.forces = this.forces.add(force);
    }

    addTorque(torque: number): void {
        this.torque += torque;
    }

    clearForces(): void {
        this.forces = new Vector2();
        this.torque = 0;
    }

    // Material properties
    getRestitution(): number {
        return this.restitution;
    }

    getFriction(): number {
        return this.friction;
    }
}
