import PhysicalObject from './PhysicalObject';

class InputControl {
    physicalObject: PhysicalObject;
    keys: {
        arrowUp: boolean;
        arrowRight: boolean;
        arrowDown: boolean;
        arrowLeft: boolean;
    };

    constructor(physicalObject: PhysicalObject) {
        this.physicalObject = physicalObject;
        this.keys = {
            arrowUp: false,
            arrowRight: false,
            arrowDown: false,
            arrowLeft: false,
        };

        this.setEventListeners();
    }

    private setEventListeners() {
        window.addEventListener('keydown', (event) => {
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

    public updatePlayerAcceleration() {
        try {
            if (!this.physicalObject) {
                throw new Error('No object is detected with "isPlayer" property set to "true".');
            }

            if (this.keys.arrowUp) {
                this.physicalObject.acceleration.y = -this.physicalObject.accelerationUnit;
            }

            if (this.keys.arrowRight) {
                this.physicalObject.acceleration.x = this.physicalObject.accelerationUnit;
            }

            if (this.keys.arrowDown) {
                this.physicalObject.acceleration.y = this.physicalObject.accelerationUnit;
            }

            if (this.keys.arrowLeft) {
                this.physicalObject.acceleration.x = -this.physicalObject.accelerationUnit;
            }

            if (!this.keys.arrowUp && !this.keys.arrowDown) {
                this.physicalObject.acceleration.y = 0;
            }

            if (!this.keys.arrowRight && !this.keys.arrowLeft) {
                this.physicalObject.acceleration.x = 0;
            }
        } catch (error) {
            console.error(error);
        }
    }
}

export default InputControl;
