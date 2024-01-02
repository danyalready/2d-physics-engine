import PhysicalObject from './PhysicalObject';
import Vector from './Vector';

describe('PhysicalObject class:', () => {
    describe('methods:', () => {
        test('`repositionate` - public method', () => {
            const physicalObject = new PhysicalObject({
                coordinate: { x: 0, y: 0 },
                elasticity: 1,
                friction: 0,
                mass: 1,
            });

            physicalObject.repositionate();

            expect(physicalObject.position).toMatchObject({ x: 0, y: 0 });

            physicalObject.velocity = physicalObject.velocity.add(new Vector({ x: 1, y: 1 }));
            physicalObject.repositionate();

            expect(physicalObject.position).toMatchObject({ x: 1, y: 1 });
        });
    });
});
