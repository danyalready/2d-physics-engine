import { Ball, InputControl, Wall } from './classes';
import { roundNumber } from './utils.js';

const DYNAMIC_OBJECTS: Ball[] = [
    new Ball({
        mass: 1,
        elasticity: 1,
        coordinate: { x: 100, y: 200 },
        radius: 15,
        accelerationUnit: 1,
        color: 'black',
        isPlayer: true,
    }),
    new Ball({
        mass: 1,
        elasticity: 0.1,
        coordinate: { x: 700, y: 200 },
        radius: 25,
        accelerationUnit: 1,
        color: 'brown',
    }),
    new Ball({
        mass: 1,
        elasticity: 0,
        coordinate: { x: 200, y: 500 },
        radius: 25,
        accelerationUnit: 1,
        color: 'brown',
    }),
    new Ball({
        mass: 1,
        elasticity: 1,
        coordinate: { x: 700, y: 700 },
        radius: 35,
        accelerationUnit: 1,
        color: 'brown',
    }),
];
const STATIC_OBJECTS = [new Wall({ coordinates: { start: { x: 100, y: 100 }, end: { x: 500, y: 500 } } })];

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const inputControl = new InputControl();

    const player = DYNAMIC_OBJECTS.find((obj) => obj.isPlayer);

    function updatePlayerAcceleration() {
        try {
            if (!player) {
                throw new Error('No object is detected with "isPlayer" property set to "true".');
            }

            if (inputControl.arrowUp) {
                player.acceleration.y = -player.accelerationUnit;
            }

            if (inputControl.arrowRight) {
                player.acceleration.x = player.accelerationUnit;
            }

            if (inputControl.arrowDown) {
                player.acceleration.y = player.accelerationUnit;
            }

            if (inputControl.arrowLeft) {
                player.acceleration.x = -player.accelerationUnit;
            }

            if (!inputControl.arrowUp && !inputControl.arrowDown) {
                player.acceleration.y = 0;
            }

            if (!inputControl.arrowRight && !inputControl.arrowLeft) {
                player.acceleration.x = 0;
            }
        } catch (error) {
            console.error(error);
        }
    }

    function draw() {
        STATIC_OBJECTS.forEach((obj) => obj.draw(canvasCtx));
        DYNAMIC_OBJECTS.forEach((ball, index) => {
            if (ball.isPlayer) {
                ball.displayVectors(canvasCtx);
                ball.displayFixedVectors(canvasCtx);
            }

            for (let i = index + 1; i < DYNAMIC_OBJECTS.length; i++) {
                const distanceVector = DYNAMIC_OBJECTS[index].position.subtr(DYNAMIC_OBJECTS[i].position);
                const distanceRoundMagnitude = roundNumber(distanceVector.magnitude, 3);

                if (Ball.isCollision(DYNAMIC_OBJECTS[index], DYNAMIC_OBJECTS[i], distanceRoundMagnitude)) {
                    Ball.resolvePenetration(DYNAMIC_OBJECTS[index], DYNAMIC_OBJECTS[i]);
                    Ball.resolveCollision(DYNAMIC_OBJECTS[index], DYNAMIC_OBJECTS[i]);
                }
            }

            ball.repositionate();
            ball.draw(canvasCtx);
        });

        updatePlayerAcceleration();
    }

    (function mainLoop() {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        draw();

        requestAnimationFrame(mainLoop);
    })();
});
