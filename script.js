import Ball from './classes/Ball.js';

const GRAVITY = 0;
const FRICTION = 0.025;

const START_TIME = Date.now();

window.addEventListener('load', () => {
    let IS_UP, IS_RIGHT, IS_DOWN, IS_LEFT;

    const canvas = document.getElementById('canvas');
    const canvasCtx = canvas.getContext('2d');

    const balls = [
        new Ball(canvasCtx, { x: 100, y: 200, r: 25, a: 1 }),
        new Ball(canvasCtx, { x: 200, y: 300, r: 55, a: 0.2 }),
        new Ball(canvasCtx, { x: 400, y: 300, r: 15, a: 1.2 }),
        new Ball(canvasCtx, { x: 100, y: 600, r: 5, a: 2 }),
    ];
    const currentBall = balls[1];

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
            currentBall.accelerationY = -currentBall.acceleration;
        }

        if (IS_RIGHT) {
            currentBall.accelerationX = currentBall.acceleration;
        }

        if (IS_DOWN) {
            currentBall.accelerationY = currentBall.acceleration;
        }

        if (IS_LEFT) {
            currentBall.accelerationX = -currentBall.acceleration;
        }

        if (!IS_UP && !IS_DOWN) {
            currentBall.accelerationY = 0;
        }

        if (!IS_RIGHT && !IS_LEFT) {
            currentBall.accelerationX = 0;
        }

        currentBall.velocityX += currentBall.accelerationX;
        currentBall.velocityY += currentBall.accelerationY;
        currentBall.velocityX *= 1 - FRICTION;
        currentBall.velocityY *= 1 - FRICTION;
        currentBall.positionX += currentBall.velocityX;
        currentBall.positionY += currentBall.velocityY;
    }

    function draw() {
        const CURR_TIME = Date.now();
        const PASS_SECS = Math.floor((CURR_TIME - START_TIME) / 1000);
        move();

        balls.forEach((ball) => {
            ball.update();
        });
    }

    (function mainLoop() {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        draw();

        requestAnimationFrame(mainLoop);
    })();
});
