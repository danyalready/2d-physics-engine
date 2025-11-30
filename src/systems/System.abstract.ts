import { Scene } from '../core/Scene';

export abstract class System {
    abstract readonly needsFixedUpdate: boolean;

    abstract update(deltaTime: number, scene: Scene): void;
}
