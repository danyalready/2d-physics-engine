import Vector from '../Vector/Vector';
import Body from './Body';

describe('Body class:', () => {
    describe('values:', () => {
        test('', () => {});
    });

    describe('methods:', () => {
        test('`reposition` - public method', () => {
            const body = new Body({ coordinate: { x: 0, y: 0 } });

            body.reposition();

            expect(body.position).toMatchObject({ x: 0, y: 0 });

            body.linVelocity = body.linVelocity.add(new Vector({ x: 1, y: 1 }));
            body.reposition();

            expect(body.position).toMatchObject({ x: 1, y: 1 });
        });
    });
});
