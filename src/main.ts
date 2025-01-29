import { TransformComponent } from './components/TransformComponent';
import { Engine } from './core/Engine';
import { Entity } from './core/Entity';
import { InputManager } from './core/InputManager';
import { Scene } from './core/Scene';
import { Vector2D } from './math/Vector2D';

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const inputManager = new InputManager();

    const engine = new Engine(inputManager, canvas, canvasCtx);
    const scene = new Scene();

    // ====== OPEN PLAYGROUND ======

    const entity1 = new Entity();
    entity1.addComponent(new TransformComponent(new Vector2D(600, 400)));

    const entity2 = new Entity();
    entity2.addComponent(new TransformComponent(new Vector2D(200, 350)));

    scene.addEntity(entity1);
    scene.addEntity(entity2);

    // ====== CLOSE PLAYGROUND ======

    engine.setScene(scene);
    engine.start();
});
