import Vector from "./Vector.js";

class Ball {
    constructor(params) {
        this.radius = params.r;
        this.color = params.c || "black";
        this.position = new Vector({ x: params.x, y: params.y });
        this.velocity = new Vector({ x: 0, y: 0 });
        this.acceleration = new Vector({ x: 0, y: 0 });
        this.accelerationUnit = params.a;
    }

    update(ctx) {
        this.draw(ctx);
        this.debug(ctx);
    }

    debug(ctx) {
        this.acceleration.draw(ctx, { x: this.position.x, y: this.position.y, n: 100, c: "green" });
        this.velocity.draw(ctx, { x: this.position.x, y: this.position.y, n: 10, c: "red" });
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

export default Ball;
