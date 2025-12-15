import { Scene } from '../../core/Scene';
import { Vector2 } from '../../math/Vector2';
import { ReactorBlock } from './ReactorBlock';

interface Props {
    position: Vector2;
    size: { cols: number; rows: number };
    scene: Scene;
}

export class ReactorSection {
    private blockGap: number = 22;
    private scene: Scene;

    blocks: ReactorBlock[][] = [];
    position: Vector2;
    size: { cols: number; rows: number };

    constructor(props: Props) {
        this.scene = props.scene;
        this.position = props.position;
        this.size = props.size;

        this.initializeBlocks();
    }

    private initializeBlocks() {
        for (let rowIndex = 0; rowIndex < this.size.rows; rowIndex++) {
            const rowBlocks: ReactorBlock[] = [];

            for (let colIndex = 0; colIndex < this.size.cols; colIndex++) {
                const block = new ReactorBlock({
                    position: new Vector2(
                        this.position.x + colIndex * this.blockGap,
                        this.position.y + rowIndex * this.blockGap,
                    ),
                    scene: this.scene,
                });

                rowBlocks.push(block);
            }

            this.blocks.push(rowBlocks);
        }
    }
}
