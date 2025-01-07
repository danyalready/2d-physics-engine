import { Engine } from './core/Engine';
import { InputManager } from './core/InputManager';
import { Renderer } from './core/Renderer';
import { Scene } from './core/Scene';

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const renderer = new Renderer(canvas, canvasCtx);
    const inputManager = new InputManager();

    const engine = new Engine(renderer, inputManager);
    const scene = new Scene();

    engine.setScene(scene);
    engine.start();
    // engine.stop();
});
