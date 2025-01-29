export interface ComponentType {
    readonly componentId: symbol;

    onStart?(): void;
    onDestroy?(): void;
    update(deltaTime: number): void;
}

export abstract class Component implements ComponentType {
    abstract readonly componentId: symbol;

    onStart(): void {}
    onDestroy(): void {}

    abstract update(deltaTime: number): void;
}
