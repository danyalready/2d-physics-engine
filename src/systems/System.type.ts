import { Scene } from '../core/Scene';

export interface System {
    readonly needsFixedUpdate: boolean;

    update(scene: Scene, deltaTime: number): void;
}
