import PhysicalObject from './PhysicalObject';
import Vector from './Vector';

describe('PhysicalObject class:', () => {
    describe('values:', () => {
        test('', () => {});
    });

    describe('methods:', () => {
        test('`repositionate` - public method', () => {
            const physicalObject = new PhysicalObject({ coordinate: { x: 0, y: 0 } });

            physicalObject.repositionate();

            expect(physicalObject.position).toMatchObject({ x: 0, y: 0 });

            physicalObject.linVelocity = physicalObject.linVelocity.add(new Vector({ x: 1, y: 1 }));
            physicalObject.repositionate();

            expect(physicalObject.position).toMatchObject({ x: 1, y: 1 });
        });
    });
});
