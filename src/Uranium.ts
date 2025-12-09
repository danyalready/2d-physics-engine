import { CircleCollider } from './components/ColliderComponents/CircleCollider.component';
import { CircleDrawer } from './components/DrawerComponents/CircleDrawer.component';
import { Rigidbody } from './components/Rigidbody.component';
import { Transform } from './components/Transform.component';
import { Entity } from './core/Entity';
import { Scene } from './core/Scene';
import { Vector2 } from './math/Vector2';
import { Neutron } from './Neutron';

export class Uranium extends Entity {
    constructor(position: Vector2, scene: Scene) {
        super('Uranium');

        this.addComponent(
            new CircleCollider(7, {
                detector: { layer: 1 << 0, mask: 1 << 1 },
                resolver: { layer: 1 << 1, mask: 1 << 0 },
            }),
        );
        this.addComponent(new CircleDrawer({ radius: 7, fillColor: 'orange' }));
        this.addComponent(new Transform(position));

        const collider = this.getComponent(CircleCollider)!;

        collider.onCollideStay = (event) => {
            if (event.otherEntity.name === 'Neutron') {
                scene.removeEntity(event.otherEntity);
                scene.removeEntity(this);

                const releaseAmount = Math.floor(Math.random() * (3 - 2 + 1)) + 2;

                for (let i = 0; i < releaseAmount; i++) {
                    const neutron = new Neutron(position);
                    const neutronRigidbody = neutron.getComponent(Rigidbody)!;

                    neutronRigidbody.setVelocity(new Vector2(250, 0).rotate(Math.random() * Math.PI * 2));
                    scene.addEntity(neutron);
                }
            }
        };
    }
}
