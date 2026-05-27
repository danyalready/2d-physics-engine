import { CircleCollider } from '../../components/ColliderComponents/CircleCollider.component';
import { CircleDrawer } from '../../components/DrawerComponents/CircleDrawer.component';
import { Transform } from '../../components/Transform.component';
import { Entity } from '../../core/Entity';
import { Vector2 } from '../../math/Vector2';
import { Neutron } from './Neutron';
import { Uranium } from './Uranium';

interface Props {
    position: Vector2;
    onCollideWithNeutron: (neutron: Neutron, xenon?: Xenon) => void;
}

export class Xenon extends Entity {
    static readonly layer: number = 1 << 6;

    private health: number = 1;

    constructor(props: Props) {
        super('Xenon');

        this.addComponent(new Transform(props.position));
        this.addComponent(new CircleDrawer({ radius: 7, fillColor: 'black' }));
        this.addComponent(
            new CircleCollider(7, {
                detector: { layer: Uranium.layer, mask: Neutron.tLayer },
                resolver: { layer: Uranium.layer, mask: Neutron.tLayer },
            }),
        );

        const collider = this.getComponent(CircleCollider)!;

        collider.onCollideEntry = (event) => {
            if (event.otherEntity.name === 'Neutron') {
                props.onCollideWithNeutron(event.otherEntity as Neutron, this.health <= 0 ? this : undefined);
                this.health--;
            }
        };
    }
}
