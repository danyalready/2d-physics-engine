import { Rigidbody } from './components/Rigidbody.component';
import { InputManager } from './core/InputManager';
import { Iterator } from './core/Iterator';
import { Scene } from './core/Scene';
import { Vector2 } from './math/Vector2';

import { ControlRod } from './rbmk/ControlRod';
import { Neutron } from './rbmk/Neutron';
import { Uranium } from './rbmk/Uranium';
import { Moderator } from './rbmk/Moderator';
import { Water } from './rbmk/Water';
import { ReactorBlock } from './rbmk/ReactorBlock';

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

// const id = setInterval(() => {
//     const neutron = new Neutron({
//         position: new Vector2(100, 450),
//         onLostEnergy: (neutron) => scene.removeEntity(neutron),
//     });
//     neutron.getComponent(Rigidbody)!.setVelocity(new Vector2(Neutron.speed, 0));
//     // neutron.setToThermal();
//     scene.addEntity(neutron);
// }, 1000);

// setTimeout(() => {
//     clearInterval(id);
// }, 8000);

for (let i = 0; i < 35; i++) {
    for (let j = 0; j < 4; j++) {
        new ReactorBlock({
            position: new Vector2(300 + i * 22, 450 + j * 22),
            parent: scene,
        });
    }
}

iterator.setScene(scene);
iterator.start();
