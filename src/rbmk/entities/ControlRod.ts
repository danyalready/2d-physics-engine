import { BoxCollider } from '../../components/ColliderComponents/BoxCollider.component';
import { BoxDrawer } from '../../components/DrawerComponents/BoxDrawer.component';
import { Transform } from '../../components/Transform.component';
import { Entity } from '../../core/Entity';
import { Scene } from '../../core/Scene';
import { Vector2 } from '../../math/Vector2';
import { RBMK_LAYERS } from './layers';

const HEIGHT = 500;

export class ControlRod extends Entity {
    static readonly layer: number = RBMK_LAYERS.controlRod;

    constructor(position: Vector2, scene: Scene) {
        super('ControlRod');

        this.addComponent(
            new BoxCollider(
                { width: 5, height: HEIGHT },
                {
                    detector: {
                        layer: ControlRod.layer,
                        mask: RBMK_LAYERS.neutronFast | RBMK_LAYERS.neutronThermal,
                    },
                    resolver: {
                        layer: ControlRod.layer,
                        mask: RBMK_LAYERS.neutronFast | RBMK_LAYERS.neutronThermal,
                    },
                },
            ),
        );
        this.addComponent(new BoxDrawer({ size: { width: 5, height: HEIGHT }, fillColor: 'black' }));
        this.addComponent(new Transform(position));

        const collider = this.getComponent(BoxCollider)!;

        collider.onCollideEntry = (event) => {
            if (event.otherEntity.name === 'Neutron') {
                scene.removeEntity(event.otherEntity);
            }
        };
    }
}
