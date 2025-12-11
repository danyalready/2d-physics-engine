import { Rigidbody } from './components/Rigidbody.component';
import { InputManager } from './core/InputManager';
import { Iterator } from './core/Iterator';
import { Scene } from './core/Scene';
import { Vector2 } from './math/Vector2';

import { Neutron } from './rbmk/Neutron';
import { Moderator } from './rbmk/Moderator';
import { ReactorSection } from './rbmk/ReactorSection';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

const inputManager = new InputManager();

const iterator = new Iterator(inputManager, canvas, canvasCtx, { debug: true });
const scene = new Scene();

const neutron = new Neutron({
    position: new Vector2(100, 450),
    onLostEnergy: (neutron) => scene.removeEntity(neutron),
});
neutron.getComponent(Rigidbody)!.setVelocity(new Vector2(Neutron.speed, 0));

scene.addEntity(neutron);

for (let i = 0; i < 6; i++) {
    new ReactorSection(new Vector2(400 + i * 105, 200), { cols: 4, rows: 20 }, scene);

    if (i < 5) scene.addEntity(new Moderator(new Vector2(383.5 + (i + 1) * 105, 425)));
}

iterator.setScene(scene);
iterator.start();
