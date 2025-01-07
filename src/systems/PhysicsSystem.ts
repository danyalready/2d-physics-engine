import { RigidbodyComponent } from '../components/RigidbodyComponent';
import { TransformComponent } from '../components/TransformComponent';
import { Scene } from '../core/Scene';
import { type System } from './System.type';

export class PhysicsSystem implements System {
    readonly needsFixedUpdate = true;

    update(scene: Scene, deltaTime: number): void {
        const entities = scene.getAllEntities();

        for (const entity of entities) {
            const transform = entity.getComponent(TransformComponent);
            const rigidbody = entity.getComponent(RigidbodyComponent);

            if (transform && rigidbody) {
                // Apply velocity
                const velocity = rigidbody.getVelocity();
                const newPosition = transform.getPosition().add(velocity.scale(deltaTime));
                transform.setPosition(newPosition);

                // Apply angular velocity
                const angularVel = rigidbody.getAngularVelocity();
                transform.setRotation(transform.getRotation() + angularVel * deltaTime);

                // Apply forces and torques
                rigidbody.applyAccumulatedForces(deltaTime);
            }
        }
    }
}
