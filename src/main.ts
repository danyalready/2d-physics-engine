import { Rigidbody } from './components/Rigidbody.component';
import { InputManager } from './core/InputManager';
import { Iterator } from './core/Iterator';
import { Scene } from './core/Scene';

import { ControlRod } from './rbmk/ControlRod';
import { Vector2 } from './math/Vector2';
import { Neutron } from './rbmk/Neutron';
import { Uranium } from './rbmk/Uranium';
import { Moderator } from './rbmk/Moderator';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

const inputManager = new InputManager();

const iterator = new Iterator(inputManager, canvas, canvasCtx, { debug: true });
const scene = new Scene();

// ControlRod
const controlRod = new ControlRod(new Vector2(400, 450), scene);

// Moderator
const moderator1 = new Moderator(new Vector2(1100, 450));
const moderator2 = new Moderator(new Vector2(800, 450));
const moderator3 = new Moderator(new Vector2(500, 450));

// Setup scene
const entities = [controlRod];

// Generate U-235 particles
for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 25; j++) {
        entities.push(new Uranium(new Vector2(450 + 25 * i, 150 + 25 * j), scene));
    }
}

// Neutron
const neutron = new Neutron(new Vector2(420, 450));
const neutronRigidbody = neutron.getComponent(Rigidbody)!;

setTimeout(() => {
    neutronRigidbody.setVelocity(new Vector2(Neutron.speed, 0));
}, 1000);

entities.push(neutron);
entities.push(moderator1);
entities.push(moderator2);
entities.push(moderator3);
entities.forEach((entity) => scene.addEntity(entity));

iterator.setScene(scene);
iterator.start();
