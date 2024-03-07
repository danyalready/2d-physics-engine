import Wall from './Wall';
import PhysicalObject from '../PhysicalObject/PhysicalObject';

describe('Wall class:', () => {
    const wall = new Wall({ coordinates: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } } });

    describe('values:', () => {
        test.skip('`vector`', () => {
            expect(wall.unit).toMatchObject({ x: 1, y: 1 });
        });
    });

    describe('methods:', () => {
        test('`getClosestPoint` - static method', () => {
            const physicalObject1 = new PhysicalObject({
                coordinate: { x: -1, y: -1 },
                elasticity: 1,
                friction: 0,
                mass: 1,
            });
            const physicalObject2 = new PhysicalObject({
                coordinate: { x: 2, y: 2 },
                elasticity: 1,
                friction: 0,
                mass: 1,
            });

            const closestPoint1 = wall.getClosestPoint(physicalObject1.getClosestPointTo(wall.position));
            const closestPoint2 = wall.getClosestPoint(physicalObject2.getClosestPointTo(wall.position));

            expect(closestPoint1).toMatchObject({ x: 0, y: 0 });
            expect(closestPoint2).toMatchObject({ x: 1, y: 1 });
        });
    });
});
