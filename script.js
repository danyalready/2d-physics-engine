import Ball from "./classes/Ball.js";

const FRICTION = 0.025;

window.addEventListener("load", () => {
    let IS_UP, IS_RIGHT, IS_DOWN, IS_LEFT;

    const canvas = document.getElementById("canvas");
    const canvasCtx = canvas.getContext("2d");

    const balls = [
        new Ball({ x: 100, y: 200, r: 25, a: 1 }),
        new Ball({ x: 200, y: 300, r: 55, a: 0.2 }),
        new Ball({ x: 400, y: 300, r: 15, a: 1.2 }),
        new Ball({ x: 100, y: 600, r: 5, a: 2 }),
    ];
    const currentBall = balls[0];

    window.addEventListener("keydown", (event) => {
        if (event.code === "ArrowUp") {
            IS_UP = true;
        }

        if (event.code === "ArrowRight") {
            IS_RIGHT = true;
        }

        if (event.code === "ArrowDown") {
            IS_DOWN = true;
        }

        if (event.code === "ArrowLeft") {
            IS_LEFT = true;
        }
    });

    window.addEventListener("keyup", (event) => {
        if (event.code === "ArrowUp") {
            IS_UP = false;
        }

        if (event.code === "ArrowRight") {
            IS_RIGHT = false;
        }

        if (event.code === "ArrowDown") {
            IS_DOWN = false;
        }

        if (event.code === "ArrowLeft") {
            IS_LEFT = false;
        }
    });

    function move() {
        if (IS_UP) {
            currentBall.acceleration.y = -currentBall.accelerationUnit;
        }

        if (IS_RIGHT) {
            currentBall.acceleration.x = currentBall.accelerationUnit;
        }

        if (IS_DOWN) {
            currentBall.acceleration.y = currentBall.accelerationUnit;
        }

        if (IS_LEFT) {
            currentBall.acceleration.x = -currentBall.accelerationUnit;
        }

        if (!IS_UP && !IS_DOWN) {
            currentBall.acceleration.y = 0;
        }

        if (!IS_RIGHT && !IS_LEFT) {
            currentBall.acceleration.x = 0;
        }

        currentBall.velocity = currentBall.velocity.add(currentBall.acceleration);
        currentBall.velocity = currentBall.velocity.mult(1 - FRICTION);
        currentBall.position = currentBall.position.add(currentBall.velocity);
    }

    function draw() {
        move();

        balls.forEach((ball) => {
            ball.update(canvasCtx);
        });
    }

    (function mainLoop() {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        draw();

        requestAnimationFrame(mainLoop);
    })();
});
