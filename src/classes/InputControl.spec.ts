import InputControl from './InputControl';

describe('InputControl class:', () => {
    test('event listener variables are falsy by default', () => {
        const inputControl = new InputControl();

        expect(inputControl.arrowUp).toBeFalsy();
        expect(inputControl.arrowRight).toBeFalsy();
        expect(inputControl.arrowDown).toBeFalsy();
        expect(inputControl.arrowLeft).toBeFalsy();
    });

    test('event listener variables should get updated on key presses', () => {
        const inputControl = new InputControl();

        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp' }));
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown' }));
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft' }));

        expect(inputControl.arrowUp).toBeTruthy();
        expect(inputControl.arrowRight).toBeTruthy();
        expect(inputControl.arrowDown).toBeTruthy();
        expect(inputControl.arrowLeft).toBeTruthy();

        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowUp' }));
        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowRight' }));
        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowDown' }));
        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowLeft' }));

        expect(inputControl.arrowUp).toBeFalsy();
        expect(inputControl.arrowRight).toBeFalsy();
        expect(inputControl.arrowDown).toBeFalsy();
        expect(inputControl.arrowLeft).toBeFalsy();
    });
});
