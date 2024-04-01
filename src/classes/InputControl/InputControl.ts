import Body from '../Body/Body';

class InputControl {
    physicalObject: Body;
    keys: {
        cw: boolean; // clockwise
        acw: boolean; // anticlockwise

        arrowUp: boolean;
        arrowRight: boolean;
        arrowDown: boolean;
        arrowLeft: boolean;
    };

    constructor(physicalObject: Body) {
        this.physicalObject = physicalObject;
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
            if (event.code === 'KeyE') {
                this.keys.cw = true;
            }

            if (event.code === 'KeyQ') {
                this.keys.acw = true;
            }

            if (event.code === 'ArrowUp') {
                this.keys.arrowUp = true;
            }

            if (event.code === 'ArrowRight') {
                this.keys.arrowRight = true;
            }

            if (event.code === 'ArrowDown') {
                this.keys.arrowDown = true;
            }

            if (event.code === 'ArrowLeft') {
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

            if (event.code === 'ArrowUp') {
                this.keys.arrowUp = false;
            }

            if (event.code === 'ArrowRight') {
                this.keys.arrowRight = false;
            }

            if (event.code === 'ArrowDown') {
                this.keys.arrowDown = false;
            }

            if (event.code === 'ArrowLeft') {
                this.keys.arrowLeft = false;
            }
        });
    }

    public updatePhysicalObjectAcceleration() {
        try {
            if (!this.physicalObject) {
                throw new Error('No object is detected with "isPlayer" property set to "true".');
            }

            if (this.keys.cw) {
                this.physicalObject.angAcceleration = -this.physicalObject.angAccelerationUnit;
            }

            if (this.keys.acw) {
                this.physicalObject.angAcceleration = this.physicalObject.angAccelerationUnit;
            }

            if (this.keys.arrowUp) {
                this.physicalObject.linAcceleration.y = -this.physicalObject.linAccelerationUnit;
            }

            if (this.keys.arrowRight) {
                this.physicalObject.linAcceleration.x = this.physicalObject.linAccelerationUnit;
            }

            if (this.keys.arrowDown) {
                this.physicalObject.linAcceleration.y = this.physicalObject.linAccelerationUnit;
            }

            if (this.keys.arrowLeft) {
                this.physicalObject.linAcceleration.x = -this.physicalObject.linAccelerationUnit;
            }

            if (!this.keys.cw && !this.keys.acw) {
                this.physicalObject.angAcceleration = 0;
            }

            if (!this.keys.arrowUp && !this.keys.arrowDown) {
                this.physicalObject.linAcceleration.y = 0;
            }

            if (!this.keys.arrowRight && !this.keys.arrowLeft) {
                this.physicalObject.linAcceleration.x = 0;
            }
        } catch (error) {
            console.error(error);
        }
    }
}

export default InputControl;
