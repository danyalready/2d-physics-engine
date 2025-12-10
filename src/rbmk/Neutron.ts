import { CircleCollider } from '../components/ColliderComponents/CircleCollider.component';
import { CircleDrawer } from '../components/DrawerComponents/CircleDrawer.component';
import { Rigidbody } from '../components/Rigidbody.component';
import { Transform } from '../components/Transform.component';
import { Entity } from '../core/Entity';
import { Vector2 } from '../math/Vector2';
import { ControlRod } from './ControlRod';
import { Moderator } from './Moderator';
import { Uranium } from './Uranium';
import { Water } from './Water';

interface Props {
    position: Vector2;
    onLostEnergy: (neutron: Neutron) => void;
}

export class Neutron extends Entity {
    static readonly nLayer: number = 1 << 4;
    static readonly tLayer: number = 1 << 3;
    static readonly speed: number = 500;
    static readonly heatingUnit: number = 10;
    static readonly nEnergy: number = 200;
    static readonly tEnergy: number = 25;
    static readonly NEUTRON_MIN_ENERGY: number = 0.2;

    isThermal: boolean = false;
    energy: number = Neutron.nEnergy;

    private onLostEnergy: (neutron: Neutron) => void;

    constructor(props: Props) {
        super('Neutron');

        this.addComponent(new Transform(props.position));
        this.addComponent(new Rigidbody({ friction: 0, restitution: 2 }));
        this.addComponent(new CircleDrawer({ radius: 4, fillColor: 'azure' }));
        this.addComponent(
            new CircleCollider(4, {
                detector: { layer: Neutron.nLayer, mask: Moderator.layer | ControlRod.layer | Water.layer },
                resolver: { layer: Neutron.nLayer, mask: Moderator.layer | ControlRod.layer },
            }),
        );

        this.onLostEnergy = props.onLostEnergy;
    }

    update(): void {
        if (this.energy <= Neutron.NEUTRON_MIN_ENERGY) {
            this.onLostEnergy(this);
        } else if (this.energy <= 5) {
            this.setToThermal();
        }
    }

    setToThermal() {
        if (!this.isThermal) {
            this.isThermal = true;
            this.energy = Neutron.tEnergy;

            this.moderate();
        }
    }

    private moderate() {
        const collider = this.getComponent(CircleCollider)!;
        const drawer = this.getComponent(CircleDrawer)!;
        const rigidbody = this.getComponent(Rigidbody)!;

        collider.collisionFilters.detector.layer = Neutron.tLayer;
        collider.collisionFilters.resolver.layer = Neutron.tLayer;
        collider.collisionFilters.detector.mask = Uranium.layer | ControlRod.layer | Water.layer;
        collider.collisionFilters.resolver.mask = Uranium.layer | ControlRod.layer;

        drawer.options.fillColor = 'royalblue';
        rigidbody.setVelocity(rigidbody.getVelocity().scale(0.4));
    }
}
