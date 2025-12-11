import { Component } from '../components/Component.abstract';

export class Entity {
    private static nextId: number = 0;

    public id: number = Entity.nextId++;
    public active: boolean = true;

    private components = new Map<symbol, Component>();

    constructor(public readonly name: string = 'Entity') {}

    addComponent<T extends Component>(component: T): T {
        if (this.components.has(component.componentId)) {
            throw new Error(`Component ${component.constructor.name} already exists on entity ${this.name}`);
        }

        this.components.set(component.componentId, component);
        component.onStart?.();

        return component;
    }

    getComponent<T extends Component>(componentType: abstract new (...args: any[]) => T): T | undefined {
        return Array.from(this.components.values()).find((c): c is T => c instanceof componentType);
    }

    removeComponent(componentType: { new (...args: any[]): Component }): void {
        const component = this.getComponent(componentType);

        if (component) {
            component.onDestroy?.();
            this.components.delete(component.componentId);
        }
    }

    update(deltaTime: number): void {
        if (!this.active) return;

        for (const component of this.components.values()) {
            component.update?.(deltaTime, this);
        }
    }

    setActive(active: boolean): void {
        this.active = active;
    }

    destroy(): void {
        for (const component of this.components.values()) {
            component.onDestroy?.();
        }

        this.components.clear();
    }
}
