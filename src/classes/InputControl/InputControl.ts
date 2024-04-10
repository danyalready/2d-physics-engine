import { Body } from '../../bodies';

const ROTATE_CLOCKWISE_KEYS = ['KeyE'];
const ROTATE_ANTICLOCKWISE_KEYS = ['KeyQ'];
const UP_KEYS = ['ArrowUp', 'KeyW'];
const DOWN_KEYS = ['ArrowDown', 'KeyS'];
const LEFT_KEYS = ['ArrowLeft', 'KeyA'];
const RIGHT_KEYS = ['ArrowRight', 'KeyD'];

class InputControl {
    body: Body;
    keys: {
        //** Clockwise rotation. */
        cw: boolean;

        //** Anticlockwise rotation. */
        acw: boolean;

        arrowUp: boolean;
        arrowRight: boolean;
        arrowDown: boolean;
        arrowLeft: boolean;
    };

    constructor(body: Body) {
        this.body = body;
        this.keys = {
            cw: false,
            acw: false,

            arrowUp: false,
            arrowRight: false,
            arrowDown: false,
            arrowLeft: false,
        };

        this.setEventListeners();
    }

    private setEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (ROTATE_CLOCKWISE_KEYS.includes(event.code)) {
                this.keys.cw = true;
            }

            if (ROTATE_ANTICLOCKWISE_KEYS.includes(event.code)) {
                this.keys.acw = true;
            }

            if (UP_KEYS.includes(event.code)) {
                this.keys.arrowUp = true;
            }

            if (RIGHT_KEYS.includes(event.code)) {
                this.keys.arrowRight = true;
            }

            if (DOWN_KEYS.includes(event.code)) {
                this.keys.arrowDown = true;
            }

            if (LEFT_KEYS.includes(event.code)) {
                this.keys.arrowLeft = true;
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.code === 'KeyE') {
                this.keys.cw = false;
            }

            if (event.code === 'KeyQ') {
                this.keys.acw = false;
            }

            if (UP_KEYS.includes(event.code)) {
                this.keys.arrowUp = false;
            }

            if (RIGHT_KEYS.includes(event.code)) {
                this.keys.arrowRight = false;
            }

            if (DOWN_KEYS.includes(event.code)) {
                this.keys.arrowDown = false;
            }

            if (LEFT_KEYS.includes(event.code)) {
                this.keys.arrowLeft = false;
            }
        });
    }

    public updatePhysicalObjectAcceleration() {
        try {
            if (!this.body) {
                throw new Error('No object is detected with "isPlayer" property set to "true".');
            }

            if (this.keys.cw) {
                this.body.angAcceleration = this.body.angAccelerationUnit;
            }

            if (this.keys.acw) {
                this.body.angAcceleration = -this.body.angAccelerationUnit;
            }

            if (this.keys.arrowUp) {
                this.body.linAcceleration.y = -this.body.linAccelerationUnit;
            }

            if (this.keys.arrowRight) {
                this.body.linAcceleration.x = this.body.linAccelerationUnit;
            }

            if (this.keys.arrowDown) {
                this.body.linAcceleration.y = this.body.linAccelerationUnit;
            }

            if (this.keys.arrowLeft) {
                this.body.linAcceleration.x = -this.body.linAccelerationUnit;
            }

            if (!this.keys.cw && !this.keys.acw) {
                this.body.angAcceleration = 0;
            }

            if (!this.keys.arrowUp && !this.keys.arrowDown) {
                this.body.linAcceleration.y = 0;
            }

            if (!this.keys.arrowRight && !this.keys.arrowLeft) {
                this.body.linAcceleration.x = 0;
            }
        } catch (error) {
            console.error(error);
        }
    }
}

export default InputControl;
