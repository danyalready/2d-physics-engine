import Ball from './classes/Ball.js';
import Vector from './classes/Vector.js';
import { roundNumber } from './utils.js';

const FRICTION = 0.095;

window.addEventListener('load', () => {
    let IS_UP, IS_RIGHT, IS_DOWN, IS_LEFT;

    const canvas = document.getElementById('canvas');
    const canvasCtx = canvas.getContext('2d');

    const balls = [
        new Ball({ x: 100, y: 200, r: 25, a: 1, isPlayer: true }),
        new Ball({
            x: canvasCtx.canvas.offsetWidth / 2,
            y: canvasCtx.canvas.offsetHeight / 2,
            r: 15,
            a: 0.2,
            c: 'red',
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

    function move() {
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

        playerBall.acceleration = playerBall.acceleration.unit().mult(playerBall.accelerationUnit);
        playerBall.velocity = playerBall.velocity.add(playerBall.acceleration);
        playerBall.velocity = playerBall.velocity.mult(1 - FRICTION);
        playerBall.position = playerBall.position.add(playerBall.velocity);
    }

    let distanceVector = new Vector(0, 0);

    function draw() {
        move();

        distanceVector = balls[1].position.subtr(playerBall.position);
        const distanceRoundMagnitude = roundNumber(distanceVector.getMag(), 3);

        canvasCtx.fillText(
            `Disntance: ${distanceRoundMagnitude}`,
            canvasCtx.canvas.offsetWidth - 200,
            canvasCtx.canvas.offsetHeight - 200
        );
        canvasCtx.fillText(
            `Is collsion: ${Ball.isCollision(balls[0], balls[1], distanceRoundMagnitude)}`,
            canvasCtx.canvas.offsetWidth - 200,
            canvasCtx.canvas.offsetHeight - 190
        );

        balls.forEach((ball) => {
            ball.draw(canvasCtx);

            if (ball.isPlayer) {
                ball.displayVectors(canvasCtx);
                ball.debugDisplayVectors(canvasCtx);
            }
        });
    }

    (function mainLoop() {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        draw();

        requestAnimationFrame(mainLoop);
    })();
});
