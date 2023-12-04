import Ball from './Ball';
import Vector from './Vector';

describe('Ball class:', () => {
    test('repositionate public method', () => {
        const ball = new Ball({ accelerationUnit: 1, coordinate: { x: 0, y: 0 }, radius: 2 });

        ball.velocity = new Vector({ x: 1, y: 1 });
        for (let i = 0; i <= 10; i++) {
            ball.repositionate();
        }

        expect(ball.position.x).toBeGreaterThan(5);
        expect(ball.position.y).toBeGreaterThan(5);
    });

    test('isCollision static method', () => {
        const ball1 = new Ball({ accelerationUnit: 0, coordinate: { x: 5, y: 5 }, radius: 15 });
        const ball2 = new Ball({ accelerationUnit: 0, coordinate: { x: 10, y: 5 }, radius: 10 });
        const distanceMagnitude = ball1.position.subtr(ball2.position).magnitude;

        expect(Ball.isCollision(ball1, ball2, distanceMagnitude)).toBeTruthy();
    });

    test('resolvePenetration static method', () => {
        const ball1 = new Ball({ accelerationUnit: 0, coordinate: { x: 5, y: 5 }, radius: 3 });
        const ball2 = new Ball({ accelerationUnit: 0, coordinate: { x: 10, y: 5 }, radius: 3 });

        Ball.resolvePenetration(ball1, ball2);

        expect(ball1.position).toMatchObject({ x: 4.5, y: 5 });
        expect(ball2.position).toMatchObject({ x: 10.5, y: 5 });
    });
});
