import { Controller } from './components/Controller.component';
import { CircleDrawer } from './components/DrawerComponents/CircleDrawer.component';
import { Rigidbody } from './components/Rigidbody.component';
import { Transform } from './components/Transform.component';
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
    entity1.addComponent(new Transform(new Vector2D(600, 400)));
    entity1.addComponent(new Rigidbody({ friction: 10 }));
    entity1.addComponent(new CircleDrawer(50));
    entity1.addComponent(new Controller(inputManager, 100));

    const entity2 = new Entity();
    entity2.addComponent(new Transform(new Vector2D(200, 350)));
    entity2.addComponent(new CircleDrawer(70));

    scene.addEntity(entity1);
    scene.addEntity(entity2);

    // ====== CLOSE PLAYGROUND ======

    engine.setScene(scene);
    engine.start();
});
