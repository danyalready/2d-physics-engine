import { Vector2 } from '../math/Vector2';
import { ReactorBlock } from './ReactorBlock';

export class ReactorSection {
    private blockGap: number = 25;

    public readonly blocks: ReactorBlock[][] = [];

    constructor(
        public position: Vector2,
        public size: { cols: number; rows: number },
    ) {
        this.initializeBlocks();
    }

    private initializeBlocks() {
        for (let rowIndex = 0; rowIndex < this.size.rows; rowIndex++) {
            const rowBlocks: ReactorBlock[] = [];

            for (let colIndex = 0; colIndex < this.size.cols; colIndex++) {
                const block = new ReactorBlock(
                    new Vector2(
                        this.position.x + colIndex * this.blockGap,
                        this.position.y + rowIndex * this.blockGap,
                    ),
                );

                rowBlocks.push(block);
            }

            this.blocks.push(rowBlocks);
        }
    }
}
