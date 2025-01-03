import type { Component } from './Component';

export class Entity {
    private components: Map<string, Component>;
    private children: Entity[];
    public parent: Entity | null;
    public name: string;

    constructor(name: string = 'Entity') {
        this.components = new Map();
        this.children = [];
        this.parent = null;
        this.name = name;
    }

    addComponent(component: Component): void {
        this.components.set(component.constructor.name, component);
    }

    getComponent<T extends Component>(componentType: { new (...args: any[]): T }): T | undefined {
        return this.components.get(componentType.name) as T;
    }

    addChild(child: Entity): void {
        this.children.push(child);
        child.parent = this;
    }

    update(deltaTime: number): void {
        // Update all components
        this.components.forEach((component) => component.update(deltaTime));

        // Update all children
        this.children.forEach((child) => child.update(deltaTime));
    }
}
