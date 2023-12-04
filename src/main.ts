import Ball from './classes/Ball.js';
import { roundNumber } from './utils.js';

window.addEventListener('load', () => {
    let IS_UP: boolean, IS_RIGHT: boolean, IS_DOWN: boolean, IS_LEFT: boolean;

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const balls = [
        new Ball({ coordinate: { x: 100, y: 200 }, radius: 25, accelerationUnit: 1, color: 'brown', isPlayer: true }),
        new Ball({ coordinate: { x: 200, y: 600 }, radius: 25, accelerationUnit: 1, color: 'brown' }),
        new Ball({ coordinate: { x: 700, y: 900 }, radius: 25, accelerationUnit: 1, color: 'brown' }),
        new Ball({
            coordinate: {
                x: canvasCtx.canvas.offsetWidth / 2,
                y: canvasCtx.canvas.offsetHeight / 2,
            },
            radius: 5,
            accelerationUnit: 0.2,
            color: 'red',
        }),
    ];
    const playerBall = balls.find((ball) => ball.isPlayer);

    window.addEventListener('keydown', (event) => {
        if (event.code === 'ArrowUp') {
            IS_UP = true;
        }

        if (event.code === 'ArrowRight') {
            IS_RIGHT = true;
        }

        if (event.code === 'ArrowDown') {
            IS_DOWN = true;
        }

        if (event.code === 'ArrowLeft') {
            IS_LEFT = true;
        }
    });

    window.addEventListener('keyup', (event) => {
        if (event.code === 'ArrowUp') {
            IS_UP = false;
        }

        if (event.code === 'ArrowRight') {
            IS_RIGHT = false;
        }

        if (event.code === 'ArrowDown') {
            IS_DOWN = false;
        }

        if (event.code === 'ArrowLeft') {
            IS_LEFT = false;
        }
    });

    function updatePlayerAcceleration() {
        if (!playerBall) {
            throw new Error('There must be one ball in the `balls` array with the `isPlayer` property set to `true`.');
        }

        if (IS_UP) {
            playerBall.acceleration.y = -playerBall.accelerationUnit;
        }

        if (IS_RIGHT) {
            playerBall.acceleration.x = playerBall.accelerationUnit;
        }

        if (IS_DOWN) {
            playerBall.acceleration.y = playerBall.accelerationUnit;
        }

        if (IS_LEFT) {
            playerBall.acceleration.x = -playerBall.accelerationUnit;
        }

        if (!IS_UP && !IS_DOWN) {
            playerBall.acceleration.y = 0;
        }

        if (!IS_RIGHT && !IS_LEFT) {
            playerBall.acceleration.x = 0;
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
