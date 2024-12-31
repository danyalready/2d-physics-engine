import { Ball, Capsule } from './bodies';
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

                if (bodyA instanceof Ball && bodyB instanceof Ball) {
                    if (Circle.isCollision(bodyA, bodyB)) {
                        Circle.resolvePenetration(bodyA, bodyB);
                        Ball.resolveCollision(bodyA, bodyB);
                    }
                }

                if (bodyA instanceof Capsule && bodyB instanceof Capsule) {
                    const [clossestAPointToB, clossestBPointToA] = Line.getClossestPoints(bodyA.line, bodyB.line);

                    const bodyAClossestBall = new Ball({
                        ...bodyA,
                        position: clossestAPointToB,
                        radius: bodyA.radius,
                    });
                    const bodyBClossestBall = new Ball({
                        ...bodyB,
                        position: clossestBPointToA,
                        radius: bodyB.radius,
                    });

                    if (Circle.isCollision(bodyAClossestBall, bodyBClossestBall)) {
                        const { repulse } = Circle.resolvePenetration(bodyAClossestBall, bodyBClossestBall);

                        bodyA.position = bodyA.position.add(repulse);
                        bodyB.position = bodyB.position.add(repulse.mult(-1));

                        Ball.resolveCollision(bodyAClossestBall, bodyBClossestBall);

                        bodyA.linVelocity = bodyAClossestBall.linVelocity;
                        bodyB.linVelocity = bodyBClossestBall.linVelocity;
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
