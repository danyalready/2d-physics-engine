import { Ball, InputControl } from './classes';
import { roundNumber } from './utils.js';

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const inputControl = new InputControl();

    const balls = [
        new Ball({
            mass: 1,
            coordinate: { x: 100, y: 200 },
            radius: 15,
            accelerationUnit: 1,
            color: 'black',
            isPlayer: true,
        }),
        new Ball({ mass: 1, coordinate: { x: 200, y: 500 }, radius: 25, accelerationUnit: 1, color: 'brown' }),
        new Ball({ mass: 1, coordinate: { x: 600, y: 200 }, radius: 25, accelerationUnit: 1, color: 'brown' }),
        new Ball({ mass: 1, coordinate: { x: 700, y: 700 }, radius: 35, accelerationUnit: 1, color: 'brown' }),
    ];
    const playerBall = balls.find((ball) => ball.isPlayer);

    function updatePlayerAcceleration() {
        try {
            if (!playerBall) {
                throw new Error('No object is detected with "isPlayer" property set to "true".');
            }

            if (inputControl.arrowUp) {
                playerBall.acceleration.y = -playerBall.accelerationUnit;
            }

            if (inputControl.arrowRight) {
                playerBall.acceleration.x = playerBall.accelerationUnit;
            }

            if (inputControl.arrowDown) {
                playerBall.acceleration.y = playerBall.accelerationUnit;
            }

            if (inputControl.arrowLeft) {
                playerBall.acceleration.x = -playerBall.accelerationUnit;
            }

            if (!inputControl.arrowUp && !inputControl.arrowDown) {
                playerBall.acceleration.y = 0;
            }

            if (!inputControl.arrowRight && !inputControl.arrowLeft) {
                playerBall.acceleration.x = 0;
            }
        } catch (error) {
            console.error(error);
        }
    }

    function draw() {
        balls.forEach((ball, index) => {
            if (ball.isPlayer) {
                ball.displayVectors(canvasCtx);
                ball.displayFixedVectors(canvasCtx);
            }

            for (let i = index + 1; i < balls.length; i++) {
                const distanceVector = balls[index].position.subtr(balls[i].position);
                const distanceRoundMagnitude = roundNumber(distanceVector.magnitude, 3);

                if (Ball.isCollision(balls[index], balls[i], distanceRoundMagnitude)) {
                    Ball.resolvePenetration(balls[index], balls[i]);
                    Ball.resolveCollision(balls[index], balls[i]);
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
