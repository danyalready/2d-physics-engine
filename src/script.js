import Ball from './classes/Ball.js';
import Vector from './classes/Vector.js';
import { roundNumber } from './utils.js';

const FRICTION = 0.095;

window.addEventListener('load', () => {
    let IS_UP, IS_RIGHT, IS_DOWN, IS_LEFT;

    const canvas = document.getElementById('canvas');
    const canvasCtx = canvas.getContext('2d');

    const balls = [
        new Ball({ x: 100, y: 200, r: 25, a: 1, isPlayer: true, c: 'brown' }),
        new Ball({ x: 800, y: 200, r: 10, a: 1 }),
        new Ball({ x: 400, y: 600, r: 50, a: 1 }),
        new Ball({ x: 100, y: 250, r: 15, a: 1 }),
        new Ball({ x: 200, y: 200, r: 20, a: 1 }),
        new Ball({ x: 700, y: 700, r: 30, a: 1 }),
        new Ball({
            x: canvasCtx.canvas.offsetWidth / 2,
            y: canvasCtx.canvas.offsetHeight / 2,
            r: 5,
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

    function draw() {
        balls.forEach((ball, index) => {
            ball.draw(canvasCtx);

            if (ball.isPlayer) {
                ball.displayVectors(canvasCtx);
                ball.debugDisplayVectors(canvasCtx);
            }

            for (let i = index + 1; i < balls.length; i++) {
                const distanceVector = balls[index].position.subtr(balls[i].position);
                const distanceRoundMagnitude = roundNumber(distanceVector.getMag(), 3);

                if (Ball.isCollision(balls[index], balls[i], distanceRoundMagnitude)) {
                    Ball.penetrationResolution(balls[index], balls[i]);
                }
            }
        });

        move();
    }

    (function mainLoop() {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        draw();

        requestAnimationFrame(mainLoop);
    })();
});
