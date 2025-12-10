import { CircleCollider } from '../components/ColliderComponents/CircleCollider.component';
import { CircleDrawer } from '../components/DrawerComponents/CircleDrawer.component';
import { Rigidbody } from '../components/Rigidbody.component';
import { Transform } from '../components/Transform.component';
import { Entity } from '../core/Entity';
import { Vector2 } from '../math/Vector2';
import { ControlRod } from './ControlRod';
import { Moderator } from './Moderator';
import { Uranium } from './Uranium';

export class Neutron extends Entity {
    static readonly nLayer: number = 1 << 4;
    static readonly tLayer: number = 1 << 3;
    static readonly speed: number = 400;

    isThermal: boolean = false;

    constructor(position: Vector2) {
        super('Neutron');

        this.addComponent(
            new CircleCollider(4, {
                detector: { layer: Neutron.nLayer, mask: Moderator.layer | ControlRod.layer },
                resolver: { layer: Neutron.nLayer, mask: Moderator.layer | ControlRod.layer },
            }),
        );
        this.addComponent(new CircleDrawer({ radius: 4, fillColor: 'azure' }));
        this.addComponent(new Rigidbody({ friction: 0, restitution: 2 }));
        this.addComponent(new Transform(position));
    }

    moderate() {
        this.isThermal = true;

        const collider = this.getComponent(CircleCollider)!;
        const drawer = this.getComponent(CircleDrawer)!;
        const rigidbody = this.getComponent(Rigidbody)!;

        collider.collisionFilters.detector.layer = Neutron.tLayer;
        collider.collisionFilters.resolver.layer = Neutron.tLayer;
        collider.collisionFilters.detector.mask = Uranium.layer | ControlRod.layer;
        collider.collisionFilters.resolver.mask = Uranium.layer | ControlRod.layer;

        drawer.options.fillColor = 'royalblue';
        rigidbody.setVelocity(rigidbody.getVelocity().scale(0.5));
    }
}
