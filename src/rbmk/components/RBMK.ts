import { ReactorSection } from './ReactorSection';
import { Moderator } from '../entities/Moderator';
import { Neutron } from '../entities/Neutron';
import { ControlRod } from '../entities/ControlRod';
import { Scene } from '../../core/Scene';
import { Vector2 } from '../../math/Vector2';

interface Props {
    sections: number;
    scene: Scene;
}

export class RBMK {
    private sectionsDistance: number = 138;
    private sections: number;
    private scene: Scene;

    constructor(props: Props) {
        this.sections = props.sections;
        this.scene = props.scene;

        this.init();
    }

    init() {
        for (let i = 0; i < this.sections + 1; i++) {
            this.scene.addEntity(new Moderator(new Vector2(33 + i * this.sectionsDistance, 478)));

            if (i < this.sections) {
                new ReactorSection({
                    position: new Vector2(50 + i * this.sectionsDistance, 100),
                    size: { cols: 5, rows: 30 },
                    scene: this.scene,
                });
                // this.scene.addEntity(
                //     new ControlRod(new Vector2(183 + 50 + i * this.sectionsDistance, -50), this.scene),
                // );
            }
        }

        this.scene.addEntity(
            new Neutron({
                position: new Vector2(600, 500),
                onLostEnergy: (neutron) => this.scene.removeEntity(neutron),
            }),
        );
    }
}
