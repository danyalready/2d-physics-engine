import { Circle, InputControl, Wall } from './classes';
import { drawLine, roundNumber } from './utils.js';

const DYNAMIC_OBJECTS: Circle[] = [
    new Circle({
        mass: 10,
        friction: 0.025,
        elasticity: 0.5,
        coordinate: { x: 100, y: 200 },
        radius: 25,
        accelerationUnit: 0.4,
        color: 'green',
        isPlayer: true,
    }),
    // new Circle({
    //     mass: 1,
    //     friction: 0.05,
    //     elasticity: 0,
    //     coordinate: { x: 700, y: 200 },
    //     radius: 25,
    //     accelerationUnit: 1,
    //     color: 'brown',
    // }),
    // new Circle({
    //     mass: 1,
    //     elasticity: 0,
    //     coordinate: { x: 200, y: 500 },
    //     radius: 25,
    //     accelerationUnit: 1,
    //     color: 'brown',
    // }),
    // new Circle({
    //     mass: 1,
    //     elasticity: 1,
    //     coordinate: { x: 700, y: 700 },
    //     radius: 35,
    //     accelerationUnit: 1,
    //     color: 'brown',
    // }),
];
const STATIC_OBJECTS = [
    new Wall({ coordinates: { start: { x: 100, y: 100 }, end: { x: 500, y: 500 } } }),
    // new Wall({ coordinates: { start: { x: 900, y: 300 }, end: { x: 300, y: 800 } } }),
];

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
        STATIC_OBJECTS.forEach((obj) => {
            for (let i = 0; i < DYNAMIC_OBJECTS.length; i++) {
                const isCollision = Wall.isCollision(obj, DYNAMIC_OBJECTS[i]);

                console.log(isCollision);
            }

            obj.draw(canvasCtx);
        });

        DYNAMIC_OBJECTS.forEach((obj, index) => {
            if (obj.isPlayer) {
                obj.displayVectors(canvasCtx);
                obj.displayFixedVectors(canvasCtx);
            }

            for (let i = index + 1; i < DYNAMIC_OBJECTS.length; i++) {
                const distanceVector = DYNAMIC_OBJECTS[index].position.subtr(DYNAMIC_OBJECTS[i].position);
                const distanceRoundMagnitude = roundNumber(distanceVector.magnitude, 3);

                if (Circle.isCollision(DYNAMIC_OBJECTS[index], DYNAMIC_OBJECTS[i], distanceRoundMagnitude)) {
                    Circle.resolvePenetration(DYNAMIC_OBJECTS[index], DYNAMIC_OBJECTS[i]);
                    Circle.resolveCollision(DYNAMIC_OBJECTS[index], DYNAMIC_OBJECTS[i]);
                }
            }

            obj.repositionate();
            obj.draw(canvasCtx);
        });

        updatePlayerAcceleration();
    }

    (function mainLoop() {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        draw();

        requestAnimationFrame(mainLoop);
    })();
});
