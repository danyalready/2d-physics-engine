import { Coordinate } from './classes/Vector';

function drawCircle(
    canvasContext: CanvasRenderingContext2D,
    params: { coordinate: Coordinate; radius: number; isFill?: boolean; color?: CSSStyleDeclaration['color'] },
) {
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

function drawLine(
    canvasContext: CanvasRenderingContext2D,
    params: {
        from: Coordinate;
        to: Coordinate;
        color?: CSSStyleDeclaration['color'];
    },
) {
    canvasContext.beginPath();
    canvasContext.moveTo(params.from.x, params.from.y);
    canvasContext.lineTo(params.to.x, params.to.y);
    canvasContext.strokeStyle = params.color || 'black';
    canvasContext.stroke();
    canvasContext.closePath();
}

function roundNumber(number: number, precision: number) {
    const factor = 10 ** precision;

    return Math.round(number * factor) / factor;
}

export { drawCircle, drawLine, roundNumber };
