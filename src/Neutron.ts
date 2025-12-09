import { CircleCollider } from './components/ColliderComponents/CircleCollider.component';
import { CircleDrawer } from './components/DrawerComponents/CircleDrawer.component';
import { Rigidbody } from './components/Rigidbody.component';
import { Transform } from './components/Transform.component';
import { Entity } from './core/Entity';
import { Vector2 } from './math/Vector2';

export class Neutron extends Entity {
    constructor(position: Vector2) {
        super('Neutron');

        this.addComponent(
            new CircleCollider(4, {
                detector: { layer: 1 << 1, mask: 1 << 0 },
                resolver: { layer: 1 << 1, mask: 1 << 0 },
            }),
        );
        this.addComponent(new CircleDrawer({ radius: 4, fillColor: 'royalblue' }));
        this.addComponent(new Rigidbody({ friction: 0, mass: 1, restitution: 2 }));
        this.addComponent(new Transform(position));
    }
}
