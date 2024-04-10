import Circle from './Circle';
import { Vector } from '../../classes';

describe('Circle class:', () => {
    describe('methods:', () => {
        test('`isCollision` - static method', () => {
            const circleA = new Circle({
                position: new Vector({ x: 5, y: 5 }),
                radius: 15,
            });
            const circleB = new Circle({
                position: new Vector({ x: 10, y: 5 }),
                radius: 10,
            });

            expect(Circle.isCollision(circleA, circleB)).toBeTruthy();
        });

        test('`resolvePenetration` - static method', () => {
            const circleA = new Circle({
                position: new Vector({ x: 5, y: 5 }),
                radius: 3,
            });
            const circleB = new Circle({
                position: new Vector({ x: 10, y: 5 }),
                radius: 3,
            });

            Circle.resolvePenetration(circleA, circleB);

            expect(circleA.position).toMatchObject({ x: 4.5, y: 5 });
            expect(circleB.position).toMatchObject({ x: 10.5, y: 5 });
        });
    });
});
