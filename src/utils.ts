import { type Circle } from './classes/Ball';

function drawCircle(canvasContext: CanvasRenderingContext2D, params: Circle) {
    const color = params.color || 'black';

    canvasContext.beginPath();
    canvasContext.arc(params.coordinate.x, params.coordinate.y, params.radius, 0, Math.PI * 2, true);

    if (params.isFill) {
        canvasContext.fillStyle = color;
        canvasContext.fill();
    } else {
        canvasContext.strokeStyle = color;
        canvasContext.stroke();
    }

    canvasContext.closePath();
}

function roundNumber(number: number, precision: number) {
    const factor = 10 ** precision;

    return Math.round(number * factor) / factor;
}

export { drawCircle, roundNumber };
