import { Component } from '../components/Component';

export class Entity {
    private components = new Map<symbol, Component>();
    private children: Set<Entity> = new Set();
    private active: boolean = true;
    public parent: Entity | null = null;

    constructor(public readonly name: string = 'Entity') {}

    addComponent<T extends Component>(component: T): T {
        if (this.components.has(component.componentId)) {
            throw new Error(`Component ${component.constructor.name} already exists on entity ${this.name}`);
        }

        this.components.set(component.componentId, component);
        component.onStart();

        return component;
    }

    getComponent<T extends Component>(componentType: { new (...args: any[]): T }): T | undefined {
        return Array.from(this.components.values()).find((c): c is T => c instanceof componentType);
    }

    removeComponent(componentType: { new (...args: any[]): Component }): void {
        const component = this.getComponent(componentType);

        if (component) {
            component.onDestroy();
            this.components.delete(component.componentId);
        }
    }

    addChild(child: Entity): void {
        if (child.parent) child.parent.removeChild(child);

        this.children.add(child);
        child.parent = this;
    }

    removeChild(child: Entity): void {
        if (this.children.delete(child)) {
            child.parent = null;
        }
    }

    setActive(active: boolean): void {
        this.active = active;
    }

    update(deltaTime: number): void {
        if (!this.active) return;

        for (const component of this.components.values()) {
            component.update(deltaTime);
        }

        for (const child of this.children) {
            child.update(deltaTime);
        }
    }

    destroy(): void {
        for (const component of this.components.values()) {
            component.onDestroy();
        }

        for (const child of this.children) {
            child.destroy();
        }

        if (this.parent) {
            this.parent.removeChild(this);
        }

        this.components.clear();
        this.children.clear();
    }
}
