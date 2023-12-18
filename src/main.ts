import { Circle, InputControl, Wall } from './classes';
import { roundNumber } from './utils.js';

const DYNAMIC_OBJECTS: Circle[] = [
    new Circle({
        mass: 10,
        friction: 0.0015,
        elasticity: 0.5,
        coordinate: { x: 100, y: 200 },
        radius: 25,
        accelerationUnit: 0.4,
        color: 'green',
        isPlayer: true,
    }),
    new Circle({
        mass: 5,
        friction: 0.0015,
        elasticity: 0,
        coordinate: { x: 700, y: 200 },
        radius: 25,
        accelerationUnit: 1,
        color: 'brown',
        isFill: true,
    }),
    new Circle({
        mass: 1,
        friction: 0.0015,
        elasticity: 0,
        coordinate: { x: 200, y: 500 },
        radius: 25,
        accelerationUnit: 1,
        color: 'brown',
        isFill: true,
    }),
    new Circle({
        mass: 1,
        friction: 0,
        elasticity: 1,
        coordinate: { x: 700, y: 700 },
        radius: 35,
        accelerationUnit: 1,
        color: 'brown',
        isFill: true,
    }),
];
const STATIC_OBJECTS = [
    new Wall({ coordinates: { start: { x: 0, y: 5 }, end: { x: 1200, y: 5 } } }),
    new Wall({ coordinates: { start: { x: 0, y: 895 }, end: { x: 1200, y: 895 } } }),
    new Wall({ coordinates: { start: { x: 5, y: 0 }, end: { x: 5, y: 900 } } }),
    new Wall({ coordinates: { start: { x: 1195, y: 0 }, end: { x: 1195, y: 900 } } }),
    new Wall({ coordinates: { start: { x: 434, y: 300 }, end: { x: 700, y: 800 } } }),
];

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const inputControl = new InputControl(DYNAMIC_OBJECTS.find((obj) => obj.isPlayer)!);

    function draw() {
        STATIC_OBJECTS.forEach((obj) => {
            for (let i = 0; i < DYNAMIC_OBJECTS.length; i++) {
                if (Wall.isCollision(obj, DYNAMIC_OBJECTS[i])) {
                    Wall.resolvePenetration(obj, DYNAMIC_OBJECTS[i]);
                    Wall.resolveCollision(obj, DYNAMIC_OBJECTS[i]);

                    DYNAMIC_OBJECTS[i].repositionate();
                }
            }

            obj.draw(canvasCtx);
        });

        DYNAMIC_OBJECTS.forEach((obj, index) => {
            if (obj.isPlayer) {
                obj.displayVectors(canvasCtx);
                obj.displayFixedVectors(canvasCtx);
            }

            for (let i = index + 1; i < DYNAMIC_OBJECTS.length; i++) {
                const distance = DYNAMIC_OBJECTS[index].position.subtr(DYNAMIC_OBJECTS[i].position);
                const distanceRoundMagnitude = roundNumber(distance.magnitude, 3);

                if (Circle.isCollision(DYNAMIC_OBJECTS[index], DYNAMIC_OBJECTS[i], distanceRoundMagnitude)) {
                    Circle.resolvePenetration(DYNAMIC_OBJECTS[index], DYNAMIC_OBJECTS[i]);
                    Circle.resolveCollision(DYNAMIC_OBJECTS[index], DYNAMIC_OBJECTS[i]);
                }
            }

            obj.repositionate();
            obj.draw(canvasCtx);
        });

        inputControl.updatePlayerAcceleration();
    }

    (function mainLoop() {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        draw();

        requestAnimationFrame(mainLoop);
    })();
});
