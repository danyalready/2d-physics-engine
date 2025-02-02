import { Rigidbody } from '../components/Rigidbody.component';
import { Transform } from '../components/Transform.component';
import { Scene } from '../core/Scene';
import { System } from './System.abstract';

export class Physics extends System {
    readonly needsFixedUpdate = true;

    update(deltaTime: number, scene: Scene): void {
        const entities = scene.getEntities();

        for (const entity of entities) {
            const transform = entity.getComponent(Transform);
            const rigidbody = entity.getComponent(Rigidbody);

            if (!transform || !rigidbody) continue;

            // Step 1: Calculate new velocities from accumulated forces
            this.integrateForces(rigidbody, deltaTime);

            // Step 2: Update positions using new velocities
            this.integrateVelocities(transform, rigidbody, deltaTime);

            // Step 3: Clear accumulated forces for next frame
            rigidbody.clearForces();
        }
    }

    private integrateForces(rigidbody: Rigidbody, deltaTime: number): void {
        // Update linear velocity from forces
        const acceleration = rigidbody.getAccumulatedForces().scale(rigidbody.getInverseMass());
        const deltaV = acceleration.scale(deltaTime);
        rigidbody.setVelocity(rigidbody.getVelocity().add(deltaV));

        // Update angular velocity from torque
        const angularAccel = rigidbody.getTorque() / rigidbody.getInertia();
        const deltaAngularV = angularAccel * deltaTime;
        rigidbody.setAngularVelocity(rigidbody.getAngularVelocity() + deltaAngularV);
    }

    private integrateVelocities(transform: Transform, rigidbody: Rigidbody, deltaTime: number): void {
        // Update position
        const deltaPosition = rigidbody.getVelocity().scale(deltaTime);
        transform.setPosition(transform.getPosition().add(deltaPosition));

        // Update rotation (if you're tracking rotation in Transform)
        const deltaRotation = rigidbody.getAngularVelocity() * deltaTime;
        transform.setRotation(transform.getRotation() + deltaRotation);
    }
}
