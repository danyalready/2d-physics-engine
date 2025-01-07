import { Entity } from '../core/Entity';
import { Vector2D } from '../math/Vector2D';
import { type Component } from './Component.type';

export class TransformComponent implements Component {
    readonly componentId = Symbol('Transform');

    constructor(
        public entity: Entity,
        private position: Vector2D = new Vector2D(),
        private rotation: number = 0, // In radians
        private scale: Vector2D = new Vector2D(1, 1),
    ) {}

    // Transform a point from local space to world space
    public transformPoint(point: Vector2D): Vector2D {
        // First scale
        let transformed = new Vector2D(point.x * this.scale.x, point.y * this.scale.y);

        // Then rotate
        transformed = transformed.rotate(this.rotation);

        // Finally translate
        return transformed.add(this.position);
    }

    // Transform a point from world space to local space
    public inverseTransformPoint(point: Vector2D): Vector2D {
        // Subtract position
        let transformed = point.subtract(this.position);

        // Inverse rotate
        transformed = transformed.rotate(-this.rotation);

        // Inverse scale
        return new Vector2D(transformed.x / this.scale.x, transformed.y / this.scale.y);
    }

    // Getters and setters

    public getPosition(): Vector2D {
        return this.position.clone();
    }

    public setPosition(position: Vector2D): void {
        this.position = position.clone();
    }

    public getRotation(): number {
        return this.rotation;
    }

    public setRotation(rotation: number): void {
        this.rotation = rotation;
    }

    public getScale(): Vector2D {
        return this.scale.clone();
    }

    public setScale(scale: Vector2D): void {
        this.scale = scale.clone();
    }

    public update(deltaTime: number): void {
        // Component update logic if needed
    }
}
