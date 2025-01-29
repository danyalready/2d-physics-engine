import { Scene } from '../core/Scene';

export abstract class System {
    abstract readonly needsFixedUpdate: boolean;

    abstract update(scene: Scene, deltaTime: number): void;
}
