import PhysicalObject, { type PhysicalObjectParams } from './PhysicalObject';

type CapsuleParams = PhysicalObjectParams & {};

class Capsule extends PhysicalObject {
    constructor(params: CapsuleParams) {
        super(params);
    }
}

export default Capsule;
