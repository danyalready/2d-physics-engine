import { BoxCollider } from '../../components/ColliderComponents/BoxCollider.component';
import { BoxDrawer } from '../../components/DrawerComponents/BoxDrawer.component';
import { Transform } from '../../components/Transform.component';
import { Entity } from '../../core/Entity';
import { Vector2 } from '../../math/Vector2';
import type { Neutron } from './Neutron';
import { RBMK_LAYERS } from './layers';

interface Props {
    position: Vector2;
    // onInteractWithNeutron: (water: Water, neutron: Neutron) => void;
}

export class Water extends Entity {
    static readonly layer: number = RBMK_LAYERS.water;

    temperature: number = 0;

    constructor(props: Props) {
        super('Water');

        this.addComponent(new Transform(props.position));
        this.addComponent(
            new BoxDrawer({
                size: { width: 20, height: 20 },
                fillColor: this.temperatureToColor(),
            }),
        );
        this.addComponent(
            new BoxCollider(
                { width: 20, height: 20 },
                {
                    detector: {
                        layer: Water.layer,
                        mask: RBMK_LAYERS.neutronFast | RBMK_LAYERS.neutronThermal,
                    },
                    resolver: { layer: Water.layer, mask: 0 },
                },
            ),
        );

        const collider = this.getComponent(BoxCollider)!;

        collider.onCollideStay = (event) => {
            if (event.otherEntity.name === 'Neutron' && !this.isEvaporated()) {
                const neutron = event.otherEntity as Neutron;
                const energyLoss = 0.2; // 20% energy lost per collision
                const heatGain = neutron.energy * energyLoss;

                this.temperature += heatGain;
                neutron.energy *= 1 - energyLoss;
            }
        };
    }

    update(): void {
        if (this.temperature > 0) this.temperature -= 0.2;

        const drawer = this.getComponent(BoxDrawer)!;
        drawer.options.fillColor = this.temperatureToColor();
    }

    isEvaporated() {
        return this.temperature >= 100;
    }

    private temperatureToColor(): string {
        if (this.isEvaporated()) return '';

        const t = Math.max(0, Math.min(100, this.temperature));
        const ratio = t / 100;

        // Light blue (173, 216, 230)
        const start = { r: 173, g: 216, b: 230 };

        // Red-orange (255, 69, 0)
        const end = { r: 255, g: 69, b: 0 };

        const r = start.r + (end.r - start.r) * ratio;
        const g = start.g + (end.g - start.g) * ratio;
        const b = start.b + (end.b - start.b) * ratio;

        return `rgb(${r}, ${g}, ${b})`;
    }
}
