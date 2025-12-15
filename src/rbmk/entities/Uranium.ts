import { CircleCollider } from '../../components/ColliderComponents/CircleCollider.component';
import { CircleDrawer } from '../../components/DrawerComponents/CircleDrawer.component';
import { Rigidbody } from '../../components/Rigidbody.component';
import { Transform } from '../../components/Transform.component';
import { Entity } from '../../core/Entity';
import { Vector2 } from '../../math/Vector2';
import { Neutron } from './Neutron';

interface Props {
    position: Vector2;
    onFission: (uranium: Uranium, neutron: Neutron, neutrons: Neutron[]) => void;
    onNeutronLostEnergy: (neutron: Neutron) => void;
}

export class Uranium extends Entity {
    static readonly layer: number = 1 << 2;

    constructor(props: Props) {
        super('Uranium');

        this.addComponent(new Transform(props.position));
        this.addComponent(new CircleDrawer({ radius: 7, fillColor: 'springgreen' }));
        this.addComponent(
            new CircleCollider(7, {
                detector: { layer: Uranium.layer, mask: Neutron.tLayer },
                resolver: { layer: Uranium.layer, mask: Neutron.tLayer },
            }),
        );

        const collider = this.getComponent(CircleCollider)!;

        collider.onCollideEntry = (event) => {
            if (event.otherEntity.name === 'Neutron') {
                props.onFission(
                    this,
                    event.otherEntity as Neutron,
                    this.fission({ onNeutronLostEnergy: props.onNeutronLostEnergy }),
                );
            }
        };
    }

    private fission({ onNeutronLostEnergy }: { onNeutronLostEnergy: (neutron: Neutron) => void }): Neutron[] {
        const neutrons: Neutron[] = [];
        const releaseAmount = Math.floor(Math.random() * (3 - 2 + 1)) + 2;
        const position = this.getComponent(Transform)!.getPosition();

        for (let i = 0; i < releaseAmount; i++) {
            const neutron = new Neutron({ position, onLostEnergy: onNeutronLostEnergy });
            const neutronRigidbody = neutron.getComponent(Rigidbody)!;
            const neutronVelocity = new Vector2(Neutron.speed, 0).rotate(Math.random() * Math.PI * 2);

            neutronRigidbody.setVelocity(neutronVelocity);
            neutrons.push(neutron);
        }

        return neutrons;
    }
}
