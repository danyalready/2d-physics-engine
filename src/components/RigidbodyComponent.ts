import { Vector2D } from '../math/Vector2D';
import { Component } from './Component';
import { Entity } from '../core/Entity';

interface RigidbodyComponentOptions {
    mass?: number;
    restitution?: number;
    friction?: number;
}

export class RigidbodyComponent extends Component {
    private velocity = new Vector2D();
    private angularVelocity = 0;
    private forces = new Vector2D();
    private torque = 0;
    private mass = 1;
    private inertia = this.mass * 0.5; // Simple approximation for point mass
    private restitution = 1;
    private friction = 0.1;

    constructor(entity: Entity, options: RigidbodyComponentOptions) {
        super(Symbol('Rigidbody'), entity);

        this.mass = options.mass || this.mass;
        this.restitution = options.restitution || this.restitution;
        this.friction = options.friction || this.friction;
    }

    applyForce(force: Vector2D): void {
        this.forces = this.forces.add(force);
    }

    applyImpulse(impulse: Vector2D): void {
        this.velocity = this.velocity.add(impulse.scale(this.getInverseMass()));
    }

    applyTorque(torque: number): void {
        this.torque += torque;
    }

    getVelocity(): Vector2D {
        return this.velocity.clone();
    }

    setVelocity(velocity: Vector2D): void {
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

    setInertia(inertia: number): void {
        this.inertia = inertia;
    }

    getRestitution(): number {
        return this.restitution;
    }

    getFriction(): number {
        return this.friction;
    }

    update(deltaTime: number): void {
        // Apply accumulated forces
        const acceleration = this.forces.scale(this.getInverseMass());
        this.velocity = this.velocity.add(acceleration.scale(deltaTime));

        // Apply angular acceleration
        const angularAccel = this.torque / this.inertia;
        this.angularVelocity += angularAccel * deltaTime;

        // Reset forces and torque
        this.forces = new Vector2D();
        this.torque = 0;
    }
}
