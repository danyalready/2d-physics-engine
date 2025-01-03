import { Vector2 } from './Vector2';

export class Transform {
    constructor(
        private position: Vector2 = new Vector2(),
        private rotation: number = 0, // In radians
        private scale: Vector2 = new Vector2(1, 1),
    ) {}

    // Transform a point from local space to world space
    public transformPoint(point: Vector2): Vector2 {
        // First scale
        let transformed = new Vector2(point.x * this.scale.x, point.y * this.scale.y);

        // Then rotate
        transformed = transformed.rotate(this.rotation);

        // Finally translate
        return transformed.add(this.position);
    }

    // Transform a point from world space to local space
    public inverseTransformPoint(point: Vector2): Vector2 {
        // Subtract position
        let transformed = point.subtract(this.position);

        // Inverse rotate
        transformed = transformed.rotate(-this.rotation);

        // Inverse scale
        return new Vector2(transformed.x / this.scale.x, transformed.y / this.scale.y);
    }

    // Getters and setters
    public getPosition(): Vector2 {
        return this.position.clone();
    }

    public setPosition(position: Vector2): void {
        this.position = position.clone();
    }

    public getRotation(): number {
        return this.rotation;
    }

    public setRotation(rotation: number): void {
        this.rotation = rotation;
    }

    public getScale(): Vector2 {
        return this.scale.clone();
    }

    public setScale(scale: Vector2): void {
        this.scale = scale.clone();
    }
}
