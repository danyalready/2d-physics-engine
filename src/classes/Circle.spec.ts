import Circle from './Circle';
import Vector from './Vector';

describe('Circle class:', () => {
    describe('methods:', () => {
        test('`isCollision` - static method', () => {
            const ball1 = new Circle({
                coordinate: { x: 5, y: 5 },
                radius: 15,
            });
            const ball2 = new Circle({
                coordinate: { x: 10, y: 5 },
                radius: 10,
            });
            const distance = ball1.position.subtr(ball2.position);

            expect(Circle.isCollision(ball1, ball2, distance.magnitude)).toBeTruthy();
        });

        test('`resolvePenetration` - static method', () => {
            const ball1 = new Circle({
                coordinate: { x: 5, y: 5 },
                radius: 3,
            });
            const ball2 = new Circle({
                coordinate: { x: 10, y: 5 },
                radius: 3,
            });

            Circle.resolvePenetration(ball1, ball2);

            expect(ball1.position).toMatchObject({ x: 4.5, y: 5 });
            expect(ball2.position).toMatchObject({ x: 10.5, y: 5 });
        });

        // test('`resolveCollision` - static method', () => {
        //     // const ball1 = new Circle({
        //     //     mass: 1,
        //     //     friction: 0,
        //     //     elasticity: 1,
        //     //     accelerationUnit: 0,
        //     //     coordinate: { x: 5, y: 5 },
        //     //     radius: 3,
        //     // });
        //     // const ball2 = new Circle({
        //     //     mass: 1,
        //     //     friction: 0,
        //     //     elasticity: 1,
        //     //     accelerationUnit: 0,
        //     //     coordinate: { x: 10, y: 5 },
        //     //     radius: 3,
        //     // });
        // });

        test('`repositionate` - public method', () => {
            const ball = new Circle({
                coordinate: { x: 0, y: 0 },
                radius: 2,
            });

            ball.linVelocity = new Vector({ x: 1, y: 1 });
            for (let i = 0; i <= 10; i++) {
                ball.repositionate();
            }

            expect(ball.position.x).toBeGreaterThan(5);
            expect(ball.position.y).toBeGreaterThan(5);
        });
    });
});
