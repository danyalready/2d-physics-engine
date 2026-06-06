import { Component } from '../components/Component.abstract';

type ComponentConstructor<T extends Component> = abstract new (...args: any[]) => T;

export class Entity {
    private static nextId: number = 0;

    readonly id: number = Entity.nextId++;
    active: boolean = true;

    private components = new Map<symbol, Component>();
    private componentTypeCache = new Map<ComponentConstructor<Component>, Component | undefined>();

    constructor(public readonly name: string = 'Entity') {}

    addComponent<T extends Component>(component: T): T {
        component.parent = this;

        if (this.components.has(component.componentId)) {
            throw new Error(`Component ${component.constructor.name} already exists on entity ${this.name}`);
        }

        this.components.set(component.componentId, component);
        this.componentTypeCache.clear();
        component.onStart?.();

        return component;
    }

    getComponent<T extends Component>(componentType: ComponentConstructor<T>): T | undefined {
        if (this.componentTypeCache.has(componentType)) {
            return this.componentTypeCache.get(componentType) as T | undefined;
        }

        for (const component of this.components.values()) {
            if (component instanceof componentType) {
                this.componentTypeCache.set(componentType, component);
                return component as T;
            }
        }

        this.componentTypeCache.set(componentType, undefined);
        return undefined;
    }

    removeComponent(componentType: ComponentConstructor<Component>): void {
        const component = this.getComponent(componentType);

        if (component) {
            component.onDestroy?.();
            this.components.delete(component.componentId);
            this.componentTypeCache.clear();
        }
    }

    update(deltaTime: number): void {
        if (!this.active) return;

        for (const component of this.components.values()) {
            component.update?.(deltaTime);
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
        this.componentTypeCache.clear();
    }
}
