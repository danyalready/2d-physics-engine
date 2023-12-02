import Ball from './Ball';

describe('Ball class:', () => {
    test('isCollision static method', () => {
        const ball1 = new Ball({ accelerationUnit: 0, coordinate: { x: 5, y: 5 }, radius: 15 });
        const ball2 = new Ball({ accelerationUnit: 0, coordinate: { x: 10, y: 5 }, radius: 10 });
        const distanceMagnitude = ball1.position.subtr(ball2.position).magnitude;

        expect(Ball.isCollision(ball1, ball2, distanceMagnitude)).toBeTruthy();
    });
});
