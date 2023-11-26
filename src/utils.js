function drawCircle(canvasContext, params) {
    const color = params.c || 'black';

    canvasContext.beginPath();
    canvasContext.arc(params.x, params.y, params.r, 0, Math.PI * 2, true);

    if (params.isFill) {
        canvasContext.fillStyle = color;
        canvasContext.fill();
    } else {
        canvasContext.strokeStyle = color;
        canvasContext.stroke();
    }

    canvasContext.closePath();
}

function roundNumber(number, precision) {
    const factor = 10 ** precision;

    return Math.round(number * factor) / factor;
}

export { drawCircle, roundNumber };
