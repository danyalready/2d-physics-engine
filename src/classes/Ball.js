import Vector from "./Vector.js";
import { drawCircle } from "../utils.js";

class Ball {
    constructor(params) {
        this.radius = params.r;
        this.color = params.c || "black";
        this.position = new Vector({ x: params.x, y: params.y });
        this.velocity = new Vector({ x: 0, y: 0 });
        this.acceleration = new Vector({ x: 0, y: 0 });
        this.accelerationUnit = params.a;
        this.isPlayer = params.isPlayer;
    }

    displayVectors(ctx) {
        this.acceleration.draw(ctx, { x: this.position.x, y: this.position.y, n: 100, c: "green" });
        this.velocity.draw(ctx, { x: this.position.x, y: this.position.y, n: 10, c: "red" });
    }

    debugDisplayVectors(ctx) {
        const INDICATOR_OFFSET = 150;
        const INDICATOR_OFFSET_X = ctx.canvas.offsetWidth - INDICATOR_OFFSET;
        const INDICATOR_OFFSET_Y = ctx.canvas.offsetHeight - INDICATOR_OFFSET;

        drawCircle(ctx, { x: INDICATOR_OFFSET_X, y: INDICATOR_OFFSET_Y, r: this.radius });
        drawCircle(ctx, { x: INDICATOR_OFFSET_X, y: INDICATOR_OFFSET_Y, r: 100, c: "red" });

        this.velocity.draw(ctx, {
            x: INDICATOR_OFFSET_X,
            y: INDICATOR_OFFSET_Y,
            n: 5,
            c: "red",
        });

        this.acceleration.draw(ctx, {
            x: INDICATOR_OFFSET_X,
            y: INDICATOR_OFFSET_Y,
            n: 100,
            c: "green",
        });
    }

    draw(ctx) {
        drawCircle(ctx, { x: this.position.x, y: this.position.y, r: this.radius, c: this.color, isFill: true });
    }
}

export default Ball;
