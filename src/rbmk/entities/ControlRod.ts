import { BoxCollider } from '../../components/ColliderComponents/BoxCollider.component';
import { BoxDrawer } from '../../components/DrawerComponents/BoxDrawer.component';
import { Transform } from '../../components/Transform.component';
import { Entity } from '../../core/Entity';
import { Scene } from '../../core/Scene';
import { Vector2 } from '../../math/Vector2';
import { Neutron } from './Neutron';

export class ControlRod extends Entity {
    static readonly layer: number = 1 << 1;

    constructor(position: Vector2, scene: Scene) {
        super('ControlRod');

        this.addComponent(
            new BoxCollider(
                { width: 5, height: 300 },
                {
                    detector: { layer: ControlRod.layer, mask: Neutron.nLayer | Neutron.tLayer },
                    resolver: { layer: ControlRod.layer, mask: Neutron.nLayer | Neutron.tLayer },
                },
            ),
        );
        this.addComponent(new BoxDrawer({ size: { width: 5, height: 300 }, fillColor: 'black' }));
        this.addComponent(new Transform(position));

        const collider = this.getComponent(BoxCollider)!;

        collider.onCollideEntry = (event) => {
            if (event.otherEntity.name === 'Neutron') {
                scene.removeEntity(event.otherEntity);
            }
        };
    }
}
