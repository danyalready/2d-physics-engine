import { Entity } from '../core/Entity';
import { Vector2D } from '../math/Vector2D';
import { Component } from './Component';

export class TransformComponent extends Component {
    constructor(
        public entity: Entity,
        private position: Vector2D = new Vector2D(),
        private rotation: number = 0, // In radians
        private scale: Vector2D = new Vector2D(1, 1),
    ) {
        super(Symbol('Transform'), entity);
    }

    // Transform a point from local space to world space
    transformPoint(point: Vector2D): Vector2D {
        // First scale
        let transformed = new Vector2D(point.x * this.scale.x, point.y * this.scale.y);

        // Then rotate
        transformed = transformed.rotate(this.rotation);

        // Finally translate
        return transformed.add(this.position);
    }

    // Transform a point from world space to local space
    inverseTransformPoint(point: Vector2D): Vector2D {
        // Subtract position
        let transformed = point.subtract(this.position);

        // Inverse rotate
        transformed = transformed.rotate(-this.rotation);

        // Inverse scale
        return new Vector2D(transformed.x / this.scale.x, transformed.y / this.scale.y);
    }

    // Getters and setters

    getPosition(): Vector2D {
        return this.position.clone();
    }

    setPosition(position: Vector2D): void {
        this.position = position.clone();
    }

    getRotation(): number {
        return this.rotation;
    }

    setRotation(rotation: number): void {
        this.rotation = rotation;
    }

    getScale(): Vector2D {
        return this.scale.clone();
    }

    setScale(scale: Vector2D): void {
        this.scale = scale.clone();
    }

    update(deltaTime: number): void {
        // Component update logic if needed
    }
}
