import { BoxCollider } from '../../components/ColliderComponents/BoxCollider.component';
import { BoxDrawer } from '../../components/DrawerComponents/BoxDrawer.component';
import { Transform } from '../../components/Transform.component';
import { Entity } from '../../core/Entity';
import { Vector2 } from '../../math/Vector2';
import { Neutron } from './Neutron';

export class Moderator extends Entity {
    static readonly layer: number = 1 << 0;

    constructor(position: Vector2) {
        super('ControlRod');

        this.addComponent(
            new BoxCollider(
                { width: 5, height: 300 },
                {
                    detector: { layer: Moderator.layer, mask: Neutron.nLayer },
                    resolver: { layer: Moderator.layer, mask: Neutron.nLayer },
                },
            ),
        );
        this.addComponent(
            new BoxDrawer({ size: { width: 5, height: 300 }, strokeColor: 'black', fillColor: 'azure' }),
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
