class Ball {
    constructor(ctx, params) {
        this.canvasCtx = ctx;
        this.positionX = params.x;
        this.positionY = params.y;
        this.radius = params.r;
        this.color = params.c || 'black';
        this.velocityX = 0;
        this.velocityY = 0;
        this.acceleration = params.a;
        this.accelerationX = 0;
        this.accelerationY = 0;
    }

    update() {
        this.draw();
        this.debug();
    }

    debug() {
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(this.positionX, this.positionY);
        this.canvasCtx.lineTo(
            this.positionX + this.accelerationX * 100,
            this.positionY + this.accelerationY * 100
        );
        this.canvasCtx.strokeStyle = 'green';
        this.canvasCtx.stroke();
        this.canvasCtx.closePath();

        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(this.positionX, this.positionY);
        this.canvasCtx.lineTo(
            this.positionX + this.velocityX * 10,
            this.positionY + this.velocityY * 10
        );
        this.canvasCtx.strokeStyle = 'red';
        this.canvasCtx.stroke();
        this.canvasCtx.closePath();
    }

    draw() {
        this.canvasCtx.beginPath();
        this.canvasCtx.arc(
            this.positionX,
            this.positionY,
            this.radius,
            0,
            Math.PI * 2,
            true
        );
        this.canvasCtx.fillStyle = this.color;
        this.canvasCtx.fill();
        this.canvasCtx.closePath();
    }
}

export default Ball;
