import { Circle, InputControl } from './classes';
import { drawLine, roundNumber } from './utils';
import { BODIES } from './constants';

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const inputControl = new InputControl(BODIES.find((obj) => obj.isPlayer)!);

    function draw() {
        // STATIC_OBJECTS.forEach((wall) => {
        //     for (let i = 0; i < PHYSICAL_OBJECTS.length; i++) {
        //         const physicalObject = PHYSICAL_OBJECTS[i];
        //         const wallClosestPoint = wall.getClosestPoint(physicalObject.position);
        //         const objectClosestPoint = physicalObject.getClosestPointTo(wall.position);

        //         if (wall.isCollision(physicalObject)) {
        //             wall.resolvePenetration(physicalObject);
        //             wall.resolveCollision(physicalObject);

        //             physicalObject.repositionate();
        //         }

        //         drawLine(canvasCtx, { from: wallClosestPoint, to: objectClosestPoint });
        //     }

        //     wall.draw(canvasCtx);
        // });

        // PHYSICAL_OBJECTS.forEach((obj, aIndex) => {
        //     if (obj.isPlayer) {
        //         obj.displayVectors(canvasCtx);
        //     }

        //     for (let bIndex = aIndex + 1; bIndex < PHYSICAL_OBJECTS.length; bIndex++) {
        //         const physicalObjectA = PHYSICAL_OBJECTS[aIndex];
        //         const physicalObjectB = PHYSICAL_OBJECTS[bIndex];

        //         const aClosestPointToB = physicalObjectA.getClosestPointTo(physicalObjectB.position);
        //         const bClosestPointToA = physicalObjectB.getClosestPointTo(aClosestPointToB);

        //         const distance = aClosestPointToB.subtr(bClosestPointToA);

        //         if (Circle.isCollision(physicalObjectA, physicalObjectB, roundNumber(distance.magnitude, 3))) {
        //             const physicalObjectAWithClosestToB = Object.assign({}, physicalObjectA, {
        //                 position: aClosestPointToB,
        //             });
        //             const physicalObjectBWithClosestToA = Object.assign({}, physicalObjectB, {
        //                 position: bClosestPointToA,
        //             });

        //             const penetrationDetails = Circle.resolvePenetration(
        //                 physicalObjectAWithClosestToB,
        //                 physicalObjectBWithClosestToA,
        //             );

        //             physicalObjectA.position = physicalObjectA.position.add(penetrationDetails.repulse);
        //             physicalObjectB.position = physicalObjectB.position.add(penetrationDetails.repulse.mult(-1));

        //             Circle.resolveCollision(physicalObjectA, physicalObjectB);
        //         }

        //         drawLine(canvasCtx, { from: aClosestPointToB, to: bClosestPointToA });
        //     }

        //     obj.repositionate();
        //     obj.draw(canvasCtx);
        // });

        BODIES.forEach((body, bodyIndex) => {
            body.draw(canvasCtx);
            body.reposition();
        });

        inputControl.updatePhysicalObjectAcceleration();
    }

    (function mainLoop() {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        draw();

        requestAnimationFrame(mainLoop);
    })();
});
