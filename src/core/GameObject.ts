import { Transform } from '../math/Transform';

export class GameObject {
    public transform: Transform;
    private children: GameObject[] = [];
    private parent: GameObject | null = null;

    constructor() {
        this.transform = new Transform();
    }

    addChild(child: GameObject): void {
        this.children.push(child);
        child.parent = this;
    }

    update(deltaTime: number): void {
        // Override this method in derived classes
        this.children.forEach((child) => child.update(deltaTime));
    }

    render(ctx: CanvasRenderingContext2D): void {
        // Override this method in derived classes
        this.children.forEach((child) => child.render(ctx));
    }
}
