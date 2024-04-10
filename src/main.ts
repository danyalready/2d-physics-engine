import { Capsule } from './bodies';
import { Circle, InputControl } from './classes';
import { BODIES } from './constants';
import { Line } from './shapes';

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const inputControl = new InputControl(BODIES.find((obj) => obj.isPlayer)!);

    function draw() {
        BODIES.forEach((bodyA, bodyAIndex) => {
            bodyA.draw(canvasCtx);

            for (let bodyBIndex = bodyAIndex + 1; bodyBIndex < BODIES.length; bodyBIndex++) {
                const bodyB = BODIES[bodyBIndex];

                if (bodyA instanceof Capsule && bodyB instanceof Capsule) {
                    const [clossestAPointToB, clossestBPointToA] = Line.getClossestPoints(bodyA.line, bodyB.line);

                    const bodyAClossestCircle = new Circle({ position: clossestAPointToB, radius: bodyA.radius });
                    const bodyBClossestCircle = new Circle({ position: clossestBPointToA, radius: bodyB.radius });

                    if (Circle.isCollision(bodyAClossestCircle, bodyBClossestCircle)) {
                        const { repulse } = Circle.resolvePenetration(bodyAClossestCircle, bodyBClossestCircle);

                        bodyA.position = bodyA.position.add(repulse);
                        bodyB.position = bodyB.position.add(repulse.mult(-1));
                    }
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
