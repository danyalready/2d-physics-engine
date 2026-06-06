import { BoxCollider } from '../../components/ColliderComponents/BoxCollider.component';
import { BoxDrawer } from '../../components/DrawerComponents/BoxDrawer.component';
import { Transform } from '../../components/Transform.component';
import { Entity } from '../../core/Entity';
import { Vector2 } from '../../math/Vector2';
import type { Neutron } from './Neutron';
import { RBMK_LAYERS } from './layers';

const HEIGHT = 780;

export class Moderator extends Entity {
    static readonly layer: number = RBMK_LAYERS.moderator;

    constructor(position: Vector2) {
        super('Moderator');

        this.addComponent(
            new BoxCollider(
                { width: 5, height: HEIGHT },
                {
                    detector: { layer: Moderator.layer, mask: RBMK_LAYERS.neutronFast },
                    resolver: { layer: Moderator.layer, mask: RBMK_LAYERS.neutronFast },
                },
            ),
        );
        this.addComponent(
            new BoxDrawer({ size: { width: 5, height: HEIGHT }, strokeColor: 'black', fillColor: 'azure' }),
        );
        this.addComponent(new Transform(position));

        const collider = this.getComponent(BoxCollider)!;

        collider.onCollideExit = (event) => {
            if (event.otherEntity.name === 'Neutron') {
                const neutron = event.otherEntity as Neutron;

                neutron.setToThermal();
            }
        };
    }
}
