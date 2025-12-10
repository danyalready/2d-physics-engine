import { Entity } from '../core/Entity';
import { Scene } from '../core/Scene';
import { Vector2 } from '../math/Vector2';

import { Uranium } from './Uranium';
import { Water } from './Water';

interface Props {
    position: Vector2;
    parent: Scene;
}

export class ReactorBlock extends Entity {
    fuel: Uranium;
    coolant: Water;

    constructor(props: Props) {
        super('ReactorBlock');

        this.fuel = new Uranium({
            position: props.position,
            onFission: (uranium, neutron, neutrons) => {
                props.parent.removeEntity(uranium);
                props.parent.removeEntity(neutron);

                neutrons.forEach((neutron) => props.parent.addEntity(neutron));
            },
            onNeutronLostEnergy: (neutron) => {
                props.parent.removeEntity(neutron);
            },
        });
        this.coolant = new Water({ position: props.position });

        props.parent.addEntity(this.coolant);
        props.parent.addEntity(this.fuel);
    }
}
