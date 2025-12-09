import { Rigidbody } from './components/Rigidbody.component';
import { InputManager } from './core/InputManager';
import { Iterator } from './core/Iterator';
import { Scene } from './core/Scene';
import { Vector2 } from './math/Vector2';
import { Neutron } from './Neutron';
import { Uranium } from './Uranium';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

const inputManager = new InputManager();

const iterator = new Iterator(inputManager, canvas, canvasCtx, { debug: true });
const scene = new Scene();

// Neutron
const neutron = new Neutron(new Vector2(100, 450));
const neutronRigidbody = neutron.getComponent(Rigidbody)!;

setInterval(() => {
    neutronRigidbody.setVelocity(new Vector2(250, 0));
}, 3000);

// Setup scene
const entities = [neutron];

// U-235
for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 25; j++) {
        entities.push(new Uranium(new Vector2(450 + 25 * i, 150 + 25 * j), scene));
    }
}

entities.forEach((entity) => scene.addEntity(entity));

iterator.setScene(scene);
iterator.start();
