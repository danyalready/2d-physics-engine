import { CircleCollider } from '../components/ColliderComponents/CircleCollider.component';
import { CircleDrawer } from '../components/DrawerComponents/CircleDrawer.component';
import { Rigidbody } from '../components/Rigidbody.component';
import { Transform } from '../components/Transform.component';
import { Entity } from '../core/Entity';
import { Scene } from '../core/Scene';
import { Vector2 } from '../math/Vector2';
import { Neutron } from './Neutron';

const soundSound = new Audio('/snap.mp3');

soundSound.preload = 'auto';

document.addEventListener(
    'click',
    () => {
        soundSound
            .play()
            .then(() => {
                soundSound.pause();
                soundSound.currentTime = 0;
            })
            .catch(console.warn);
    },
    { once: true },
);

export class Uranium extends Entity {
    static readonly layer: number = 1 << 2;

    constructor(position: Vector2, scene: Scene) {
        super('Uranium');

        this.addComponent(
            new CircleCollider(7, {
                detector: { layer: Uranium.layer, mask: Neutron.tLayer },
                resolver: { layer: Uranium.layer, mask: Neutron.tLayer },
            }),
        );
        this.addComponent(new CircleDrawer({ radius: 7, fillColor: 'orange' }));
        this.addComponent(new Transform(position));

        const collider = this.getComponent(CircleCollider)!;

        collider.onCollideEntry = (event) => {
            if (event.otherEntity.name === 'Neutron') {
                scene.removeEntity(event.otherEntity);
                scene.removeEntity(this);

                const soundSound = new Audio('/snap.mp3');
                soundSound.currentTime = 0;
                soundSound.play().catch(() => {});

                const releaseAmount = Math.floor(Math.random() * (3 - 2 + 1)) + 2;

                for (let i = 0; i < releaseAmount; i++) {
                    const neutron = new Neutron(position);
                    const neutronRigidbody = neutron.getComponent(Rigidbody)!;

                    neutronRigidbody.setVelocity(
                        new Vector2(Neutron.speed, 0).rotate(Math.random() * Math.PI * 2),
                    );
                    scene.addEntity(neutron);
                }
            }
        };
    }
}
