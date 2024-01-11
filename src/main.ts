import { Circle, InputControl, Vector, Wall } from './classes';
import { roundNumber } from './utils';
import { STATIC_OBJECTS, DYNAMIC_OBJECTS } from './constants';

import Matrix from './classes/Matrix';
import Capsule from './classes/Capsule';

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const inputControl = new InputControl(DYNAMIC_OBJECTS.find((obj) => obj.isPlayer)!);
    const capsule = new Capsule({ coordinate: { x: 200, y: 200 }, length: 200, radius: 50, angle: 0 });

    function draw() {
        // <<< TEST STARTS >>>

        const capsuleRotationMatrix = Matrix.getRotationMatrix(capsule.angle);
        const capsuleUnitMatrix = new Matrix(2, 1);

        capsuleUnitMatrix.data = [[capsule.unit.x], [capsule.unit.y]];

        const capsuleRotatedUnitMatrix = capsuleRotationMatrix.mult(capsuleUnitMatrix);
        const capsuleRotatedUnit = new Vector({
            x: capsuleRotatedUnitMatrix.data[0][0],
            y: capsuleRotatedUnitMatrix.data[1][0],
        });

        capsule.positionStart = capsule.positionCenter.add(capsuleRotatedUnit.mult(-capsule.length / 2));
        capsule.positionEnd = capsule.positionCenter.add(capsuleRotatedUnit.mult(capsule.length / 2));

        // capsule.angle += 0.05;
        capsule.draw(canvasCtx);

        // <<< TEST ENDS >>>

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

        inputControl.updatePhysicalObjectAcceleration();
    }

    (function mainLoop() {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        draw();

        requestAnimationFrame(mainLoop);
    })();
});
