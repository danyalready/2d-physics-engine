import { InputManager } from './core/InputManager';
import { Iterator } from './core/Iterator';
import { Scene } from './core/Scene';
import { AABB } from './math/AABB';
import { Vector2 } from './math/Vector2';
import { RBMK } from './rbmk/components/RBMK';

import { BoundsCleanupSystem } from './systems/BoundsCleanup.system';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

const inputManager = new InputManager();

const iterator = new Iterator(inputManager, canvas, canvasCtx, { debug: true });
const scene = new Scene();

new RBMK({ sections: 5, scene });

iterator.addSystem(
    new BoundsCleanupSystem(new AABB(new Vector2(0, 0), new Vector2(canvas.width, canvas.width))),
);
iterator.setScene(scene);
iterator.start();
