import { Capsule } from './bodies';
import { InputControl } from './classes';
import { BODIES } from './constants';
import { drawCircle } from './utils';

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const inputControl = new InputControl(BODIES.find((obj) => obj.isPlayer)!);

    function draw() {
        BODIES.forEach((bodyA, bodyAIndex) => {
            bodyA.draw(canvasCtx);

            for (let bodyBIndex = bodyAIndex + 1; bodyBIndex < BODIES.length; bodyBIndex++) {
                const bodyB = BODIES[bodyBIndex];
                bodyB.draw(canvasCtx);

                if (bodyA instanceof Capsule && bodyB instanceof Capsule) {
                    const clossestAPointToB = bodyA.getClosestPointTo(bodyB.position);
                    const clossestBPointToA = bodyB.getClosestPointTo(clossestAPointToB);

                    const b = bodyB.getClosestPointTo(bodyA.position);
                    const a = bodyA.getClosestPointTo(b);

                    drawCircle(canvasCtx, {
                        coordinate: clossestAPointToB,
                        radius: bodyA.radius * 1.08,
                    });
                    drawCircle(canvasCtx, {
                        coordinate: clossestBPointToA,
                        radius: bodyB.radius * 1.08,
                    });

                    // if (Circle.isCollision(clossestACircle, clossestBCircle)) {
                    //     console.log('collision');
                    // }
                }
            }

            bodyA.reposition();
        });

        inputControl.updatePhysicalObjectAcceleration();
    }

    (function mainLoop() {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        draw();

        requestAnimationFrame(mainLoop);
    })();
});
