import Ball from './classes/Ball.js';

const FRICTION = 0.095;

window.addEventListener('load', () => {
    let IS_UP, IS_RIGHT, IS_DOWN, IS_LEFT;

    const canvas = document.getElementById('canvas');
    const canvasCtx = canvas.getContext('2d');

    const balls = [
        new Ball({ x: 100, y: 200, r: 25, a: 1, isPlayer: true }),
        new Ball({ x: 200, y: 300, r: 55, a: 0.2 }),
        new Ball({ x: 400, y: 300, r: 15, a: 1.2 }),
        new Ball({ x: 100, y: 600, r: 5, a: 2 }),
    ];
    const playerBall = balls.find((ball) => ball.isPlayer);

    window.addEventListener('keydown', (event) => {
        if (event.code === 'ArrowUp' || event.code === 'KeyW') {
            IS_UP = true;
        }

        if (event.code === 'ArrowRight' || event.code === 'KeyD') {
            IS_RIGHT = true;
        }

        if (event.code === 'ArrowDown' || event.code === 'KeyS') {
            IS_DOWN = true;
        }

        if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
            IS_LEFT = true;
        }
    });

    window.addEventListener('keyup', (event) => {
        if (event.code === 'ArrowUp' || event.code === 'KeyW') {
            IS_UP = false;
        }

        if (event.code === 'ArrowRight' || event.code === 'KeyD') {
            IS_RIGHT = false;
        }

        if (event.code === 'ArrowDown' || event.code === 'KeyS') {
            IS_DOWN = false;
        }

        if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
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
        move();

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
