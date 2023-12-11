class InputControl {
    arrowUp: boolean;
    arrowRight: boolean;
    arrowDown: boolean;
    arrowLeft: boolean;

    constructor() {
        this.arrowUp = false;
        this.arrowRight = false;
        this.arrowDown = false;
        this.arrowLeft = false;

        this.setEventListeners();
    }

    private setEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.code === 'ArrowUp') {
                this.arrowUp = true;
            }

            if (event.code === 'ArrowRight') {
                this.arrowRight = true;
            }

            if (event.code === 'ArrowDown') {
                this.arrowDown = true;
            }

            if (event.code === 'ArrowLeft') {
                this.arrowLeft = true;
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.code === 'ArrowUp') {
                this.arrowUp = false;
            }

            if (event.code === 'ArrowRight') {
                this.arrowRight = false;
            }

            if (event.code === 'ArrowDown') {
                this.arrowDown = false;
            }

            if (event.code === 'ArrowLeft') {
                this.arrowLeft = false;
            }
        });
    }
}

export default InputControl;
