import { Vector2D } from '../math/Vector2D';
import { Component } from './Component';
import { Entity } from '../core/Entity';

export class Rigidbody implements Component {
    readonly componentId = Symbol('Rigidbody');

    private velocity = new Vector2D();
    private angularVelocity = 0;
    private forces = new Vector2D();
    private torque = 0;
    private mass = 1;
    private inertia = 1;

    constructor(
        public entity: Entity,
        mass: number = 1,
    ) {
        this.mass = mass;
        this.inertia = mass * 0.5; // Simple approximation for point mass
    }

    applyForce(force: Vector2D): void {
        this.forces = this.forces.add(force);
    }

    applyTorque(torque: number): void {
        this.torque += torque;
    }

    applyAccumulatedForces(deltaTime: number): void {
        // Apply linear forces
        const acceleration = this.forces.scale(1 / this.mass);
        this.velocity = this.velocity.add(acceleration.scale(deltaTime));

        // Apply angular forces
        const angularAccel = this.torque / this.inertia;
        this.angularVelocity += angularAccel * deltaTime;

        // Clear accumulated forces and torque
        this.forces = new Vector2D();
        this.torque = 0;
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

    update(deltaTime: number): void {
        // Component update logic if needed
    }
}
