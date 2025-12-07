import { CircleCollider } from './components/ColliderComponents/CircleCollider.component';
import { CircleDrawer } from './components/DrawerComponents/CircleDrawer.component';
import { Rigidbody } from './components/Rigidbody.component';
import { Transform } from './components/Transform.component';
import { Iterator } from './core/Iterator';
import { Entity } from './core/Entity';
import { InputManager } from './core/InputManager';
import { Scene } from './core/Scene';
import { Vector2 } from './math/Vector2';
import { System } from './systems/System.abstract';
import { BoxCollider } from './components/ColliderComponents/BoxCollider.component';
import { BoxDrawer } from './components/DrawerComponents/BoxDrawer.component';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const inputManager = new InputManager();

const engine = new Iterator(inputManager, canvas, ctx, { debug: true });
const scene = new Scene();

// --- CONFIG ---
const SIZE = 35;
const SPAWN_INTERVAL = 100; // ms
const BALL_SPEED = 100;

// --- SPAWN FUNCTION ---
function spawnBall() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    const ball = new Entity(`Ball_${Math.random()}`);

    const transform = new Transform(new Vector2(x, y));
    const rigidbody = new Rigidbody({ mass: 1, friction: 0 });
    const collider = new CircleCollider(SIZE / 2, { layer: 1 << 0, mask: 1 << 0 });
    const drawer = new CircleDrawer(SIZE / 2);

    // Случайная скорость
    const angle = Math.random() * Math.PI * 2;
    rigidbody.setVelocity(new Vector2(Math.cos(angle), Math.sin(angle)).scale(BALL_SPEED));

    ball.addComponent(transform);
    ball.addComponent(rigidbody);
    ball.addComponent(collider);
    ball.addComponent(drawer);

    scene.addEntity(ball);
}

function spawnBox() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    // Create a box entity
    const box = new Entity(`Box_${Math.random()}`);

    const transform = new Transform(new Vector2(x, y));
    const rigidbody = new Rigidbody({ mass: 1, friction: 0.1 });
    const collider = new BoxCollider(SIZE, SIZE, { layer: 1 << 1, mask: 1 << 1 });
    const drawer = new BoxDrawer(SIZE, SIZE);

    // Случайная скорость
    const angle = Math.random() * Math.PI * 2;
    rigidbody.setVelocity(new Vector2(Math.cos(angle), Math.sin(angle)).scale(BALL_SPEED));

    box.addComponent(transform);
    box.addComponent(rigidbody);
    box.addComponent(collider);
    box.addComponent(drawer);
    scene.addEntity(box);
}

// --- REMOVE OUTSIDE ---
function removeBallsOutside() {
    const toDelete: Entity[] = [];

    for (const entity of scene.getEntities()) {
        const tr = entity.getComponent(Transform);
        if (!tr) continue;

        const { x, y } = tr.getPosition();

        if (x < -SIZE || x > canvas.width + SIZE || y < -SIZE || y > canvas.height + SIZE) {
            toDelete.push(entity);
        }
    }

    for (const e of toDelete) {
        scene.removeEntity(e);
    }
}

// --- HOOK Into engine update ---
class Ballswapn extends System {
    needsFixedUpdate = false;

    update(): void {
        removeBallsOutside();
    }
}
engine.addSystem(new Ballswapn());

// --- Start ---
engine.setScene(scene);
engine.start();

// --- Periodic spawns ---
setInterval(() => {
    spawnBall();
    spawnBox();
}, SPAWN_INTERVAL);
