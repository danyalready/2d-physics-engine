class Circle {
    constructor(x, y, r) {
        this.pX = x; // position X
        this.pY = y; // position Y
        this.dX = 0; // direction X
        this.dY = 1; // direction Y
        this.fY = 0; // force by Y
        this.vX = 0; // velocity X
        this.vY = 0; // velocity Y
        this.r = r; // radius
    }

    update(ctx) {
        if (this.pX + this.r >= 1200 || this.pX - this.r < 0) {
            this.dX *= -1;
        }

        if (this.pY + this.r >= 900 || this.pY - this.r < 0) {
            this.dY *= -1;
        }

        this.pX += this.dX;
        this.pY += this.dY;

        this.draw(ctx);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.pX, this.pY, this.r, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
    }
}

export default Circle;
