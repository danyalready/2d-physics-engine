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

            if (transform && rigidbody) {
                // Apply velocity
                transform.setPosition(transform.getPosition().add(rigidbody.getVelocity().scale(deltaTime)));

                // Apply angular velocity
                const angularVel = rigidbody.getAngularVelocity();
                transform.setRotation(transform.getRotation() + angularVel * deltaTime);

                // Apply forces and torques
                // rigidbody.applyAccumulatedForces(deltaTime);
            }
        }
    }
}
