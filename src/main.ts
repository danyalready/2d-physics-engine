import { Circle, InputControl } from './classes';
import { drawLine, roundNumber } from './utils';
import { STATIC_OBJECTS, PHYSICAL_OBJECTS } from './constants';

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const inputControl = new InputControl(PHYSICAL_OBJECTS.find((obj) => obj.isPlayer)!);

    function draw() {
        STATIC_OBJECTS.forEach((wall) => {
            for (let i = 0; i < PHYSICAL_OBJECTS.length; i++) {
                const wallClosestPoint = wall.getClosestPoint(PHYSICAL_OBJECTS[i].position);
                const objectClosestPoint = PHYSICAL_OBJECTS[i].getClosestPointTo(wall.position);

                if (wall.isCollision(PHYSICAL_OBJECTS[i])) {
                    wall.resolvePenetration(PHYSICAL_OBJECTS[i]);
                    wall.resolveCollision(PHYSICAL_OBJECTS[i]);

                    PHYSICAL_OBJECTS[i].repositionate();
                }

                drawLine(canvasCtx, { from: wallClosestPoint, to: objectClosestPoint });
            }

            wall.draw(canvasCtx);
        });

        PHYSICAL_OBJECTS.forEach((obj, aIndex) => {
            if (obj.isPlayer) {
                obj.displayVectors(canvasCtx);
            }

            for (let bIndex = aIndex + 1; bIndex < PHYSICAL_OBJECTS.length; bIndex++) {
                const aClosestPoint = PHYSICAL_OBJECTS[aIndex].getClosestPointTo(PHYSICAL_OBJECTS[bIndex].position);
                const bClosestPoint = PHYSICAL_OBJECTS[bIndex].getClosestPointTo(aClosestPoint);
                const distance = aClosestPoint.subtr(bClosestPoint);
                const distanceRoundMagnitude = roundNumber(distance.magnitude, 3);

                if (Circle.isCollision(PHYSICAL_OBJECTS[aIndex], PHYSICAL_OBJECTS[bIndex], distanceRoundMagnitude)) {
                    Circle.resolvePenetration(PHYSICAL_OBJECTS[aIndex], PHYSICAL_OBJECTS[bIndex]);
                    Circle.resolveCollision(PHYSICAL_OBJECTS[aIndex], PHYSICAL_OBJECTS[bIndex]);
                }

                drawLine(canvasCtx, { from: aClosestPoint, to: bClosestPoint });
            }

            obj.repositionate();
            obj.draw(canvasCtx);
        });

        inputControl.updatePhysicalObjectAcceleration();
    }

    (function mainLoop() {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        draw();

        requestAnimationFrame(mainLoop);
    })();
});
