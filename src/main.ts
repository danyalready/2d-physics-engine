import { CircleCollider } from './components/ColliderComponents/CircleCollider.component';
import { CircleDrawer } from './components/DrawerComponents/CircleDrawer.component';
import { Rigidbody } from './components/Rigidbody.component';
import { Transform } from './components/Transform.component';
import { Iterator } from './core/Iterator';
import { Entity } from './core/Entity';
import { InputManager } from './core/InputManager';
import { Scene } from './core/Scene';
import { Vector2 } from './math/Vector2';
import { BoxCollider } from './components/ColliderComponents/BoxCollider.component';
import { BoxDrawer } from './components/DrawerComponents/BoxDrawer.component';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const inputManager = new InputManager();

const engine = new Iterator(inputManager, canvas, ctx, { debug: true });
const scene = new Scene();

const wall1 = new Entity('Wall');
wall1.addComponent(new BoxCollider(10, 600, { layer: 1 << 0, mask: 1 << 1 }));
wall1.addComponent(new BoxDrawer({ size: { width: 10, height: 600 }, fillColor: 'black' }));
wall1.addComponent(new Transform(new Vector2(300, 450)));

const wall2 = new Entity('Wall');
wall2.addComponent(new BoxCollider(10, 600, { layer: 1 << 0, mask: 1 << 1 }));
wall2.addComponent(new BoxDrawer({ size: { width: 10, height: 600 }, fillColor: 'black' }));
wall2.addComponent(new Transform(new Vector2(1050, 450), 1.5));

const wallT = new Entity('WallTranformer');
wallT.addComponent(new BoxCollider(10, 600, { layer: 1 << 0, mask: 1 << 0 }));
wallT.addComponent(new BoxDrawer({ size: { width: 10, height: 600 }, fillColor: 'gray' }));
wallT.addComponent(new Transform(new Vector2(600, 450)));

// ==== Electron starts
const electron = new Entity('Electron');

const electronRigidbody = new Rigidbody({ friction: 0, mass: 1, restitution: 2 });
electronRigidbody.setVelocity(new Vector2(500, 0));

const electronDrawer = new CircleDrawer({ radius: 5, fillColor: 'white' });

const electronCollider = new CircleCollider(5, { layer: 1 << 1, mask: 1 << 1 });
electronCollider.onCollideEntry = (event) => {
    if (event.otherEntity.name === 'WallTranformer') {
        electronDrawer['options'].fillColor = 'red';
        electronRigidbody.setVelocity(electronRigidbody.getVelocity().scale(0.5));
        electronCollider.collisionFilter.mask = 1 << 0;
        electronCollider.onCollideEntry = undefined;
    }
};

electron.addComponent(electronCollider);
electron.addComponent(electronDrawer);
electron.addComponent(electronRigidbody);
electron.addComponent(new Transform(new Vector2(100, 450)));
// ==== Electron ends

scene.addEntity(wall1);
scene.addEntity(wall2);
scene.addEntity(wallT);
scene.addEntity(electron);

engine.setScene(scene);
engine.start();
