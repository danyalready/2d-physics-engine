import { AnimatorComponent } from '../components/AnimatorComponent';
import { Scene } from '../core/Scene';
import { System } from './System.type';

export class AnimationSystem implements System {
    readonly needsFixedUpdate = false;

    update(scene: Scene, deltaTime: number): void {
        const entities = scene.getAllEntities();

        for (const entity of entities) {
            const animator = entity.getComponent(AnimatorComponent);

            if (animator) {
                animator.update(deltaTime);
            }
        }
    }
}
