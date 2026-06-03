import { Vector2 } from '../../math/Vector2';
import { Entity } from '../../core/Entity';
import { Transform } from '../../components/Transform.component';
import { Rigidbody } from '../../components/Rigidbody.component';
import { CircleDrawer } from '../../components/DrawerComponents/CircleDrawer.component';
import { CircleCollider } from '../../components/ColliderComponents/CircleCollider.component';
import { RBMK_LAYERS } from './layers';

interface Props {
    position: Vector2;
    onLostEnergy: (neutron: Neutron) => void;
}

export class Neutron extends Entity {
    static readonly nLayer: number = RBMK_LAYERS.neutronFast;
    static readonly tLayer: number = RBMK_LAYERS.neutronThermal;
    static readonly speed: number = 450;
    static readonly heatingUnit: number = 10;
    static readonly nEnergy: number = 200;
    static readonly tEnergy: number = 40;
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
                detector: {
                    layer: RBMK_LAYERS.neutronFast | RBMK_LAYERS.neutronThermal,
                    mask: RBMK_LAYERS.moderator | RBMK_LAYERS.controlRod | RBMK_LAYERS.water,
                },
                resolver: {
                    layer: RBMK_LAYERS.neutronFast | RBMK_LAYERS.neutronThermal,
                    mask: RBMK_LAYERS.moderator | RBMK_LAYERS.controlRod,
                },
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

        collider.collisionFilters.detector.layer = RBMK_LAYERS.neutronThermal;
        collider.collisionFilters.resolver.layer = RBMK_LAYERS.neutronThermal;
        collider.collisionFilters.detector.mask =
            RBMK_LAYERS.uranium | RBMK_LAYERS.controlRod | RBMK_LAYERS.water;
        collider.collisionFilters.resolver.mask = RBMK_LAYERS.uranium | RBMK_LAYERS.controlRod;

        drawer.options.fillColor = 'royalblue';
        rigidbody.setVelocity(rigidbody.getVelocity().scale(0.44));
    }
}
