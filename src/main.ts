import { TransformComponent } from './components/TransformComponent';
import { Engine } from './core/Engine';
import { Entity } from './core/Entity';
import { InputManager } from './core/InputManager';
import { Renderer } from './core/Renderer';
import { Scene } from './core/Scene';
import { Vector2D } from './math/Vector2D';

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const renderer = new Renderer(canvas, canvasCtx);
    const inputManager = new InputManager();

    const engine = new Engine(renderer, inputManager);
    const scene = new Scene();

    // ====== OPEN PLAYGROUND ======

    const entity1 = new Entity();
    entity1.addComponent(new TransformComponent(entity1, new Vector2D(600, 400)));

    const entity2 = new Entity();
    entity2.addComponent(new TransformComponent(entity2, new Vector2D(200, 350)));

    scene.addEntity(entity1);
    scene.addEntity(entity2);

    // ====== CLOSE PLAYGROUND ======

    engine.setScene(scene);
    engine.start();
});
