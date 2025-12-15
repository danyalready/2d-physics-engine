import { Scene } from '../../core/Scene';
import { Vector2 } from '../../math/Vector2';
import { Uranium } from '../entities/Uranium';
import { Water } from '../entities/Water';

interface Props {
    position: Vector2;
    scene: Scene;
}

export class ReactorBlock {
    fuel: Uranium;
    coolant: Water;

    constructor(props: Props) {
        this.fuel = new Uranium({
            position: props.position,
            onFission: (uranium, neutron, neutrons) => {
                props.scene.removeEntity(uranium);
                props.scene.removeEntity(neutron);

                neutrons.forEach((neutron) => props.scene.addEntity(neutron));
            },
            onNeutronLostEnergy: (neutron) => props.scene.removeEntity(neutron),
        });
        this.coolant = new Water({ position: props.position });

        props.scene.addEntity(this.coolant);
        props.scene.addEntity(this.fuel);
    }
}
