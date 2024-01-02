import InputControl from './InputControl';
import Circle from './Circle';

describe('InputControl class:', () => {
    const circle = new Circle({
        coordinate: { x: 0, y: 0 },
        radius: 1,
        isPlayer: true,
    });

    test('event listener variables are falsy by default', () => {
        const inputControl = new InputControl(circle);

        expect(inputControl.keys.arrowUp).toBeFalsy();
        expect(inputControl.keys.arrowRight).toBeFalsy();
        expect(inputControl.keys.arrowDown).toBeFalsy();
        expect(inputControl.keys.arrowLeft).toBeFalsy();
    });

    test('event listener variables should get updated on key presses', () => {
        const inputControl = new InputControl(circle);

        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp' }));
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown' }));
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft' }));

        expect(inputControl.keys.arrowUp).toBeTruthy();
        expect(inputControl.keys.arrowRight).toBeTruthy();
        expect(inputControl.keys.arrowDown).toBeTruthy();
        expect(inputControl.keys.arrowLeft).toBeTruthy();

        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowUp' }));
        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowRight' }));
        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowDown' }));
        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowLeft' }));

        expect(inputControl.keys.arrowUp).toBeFalsy();
        expect(inputControl.keys.arrowRight).toBeFalsy();
        expect(inputControl.keys.arrowDown).toBeFalsy();
        expect(inputControl.keys.arrowLeft).toBeFalsy();
    });
});
