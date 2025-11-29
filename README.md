# 2D Physics Engine

A lightweight, flexible 2D physics engine built with TypeScript, featuring an Entity-Component-System (ECS) architecture. Perfect for building 2D games, simulations, and interactive applications.

## Features

-   🎮 **ECS Architecture** - Clean separation of concerns with Entity-Component-System pattern
-   🚀 **Rigidbody Physics** - Mass, velocity, forces, friction, and restitution
-   💥 **Collision Detection** - Circle-to-circle collision detection with penetration resolution
-   🎨 **Rendering System** - Built-in canvas-based rendering with custom drawers
-   🎯 **Input Management** - Keyboard and mouse input handling
-   📐 **Math Utilities** - Vector2, AABB, and QuadTree for spatial operations
-   🔧 **TypeScript** - Fully typed for better development experience
-   ⚡ **Fixed Timestep** - Stable physics simulation with configurable timestep

> **⚠️ Note:** This project is **not production-ready**. It is still under active development and primarily built for **educational purposes**, experimentation, and learning how 2D physics engines and ECS architectures work. Use it as a learning tool or prototype, but it may contain bugs, incomplete features, and performance limitations.

## Installation

```bash
npm install 2d-physics-engine
# or
yarn add 2d-physics-engine
# or
pnpm add 2d-physics-engine
```

## Quick Start

```typescript
import { Iterator, Scene, Entity, Transform, Rigidbody, CircleCollider, Vector2, InputManager } from '2d-physics-engine';

// Setup canvas
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const inputManager = new InputManager();

// Create engine
const engine = new Iterator(inputManager, canvas, ctx);

// Create scene
const scene = new Scene();

// Create an entity with physics
const ball = new Entity('Ball');
ball.addComponent(new Transform(new Vector2(100, 100)));
ball.addComponent(new Rigidbody({ mass: 1, restitution: 0.8, friction: 0.1 }));
ball.addComponent(new CircleCollider(25));

scene.addEntity(ball);

// Start the engine
engine.setScene(scene);
engine.start();
```

## Core Concepts

### Entity-Component-System

-   **Entity**: Container for components (e.g., a ball, player, wall)
-   **Component**: Data container (Transform, Rigidbody, Collider)
-   **System**: Logic that operates on entities with specific components

### Components

#### Transform

Handles position, rotation, and scale of entities.

```typescript
const transform = new Transform(
    new Vector2(100, 100), // position
    0, // rotation (radians)
    new Vector2(1, 1), // scale
);
```

#### Rigidbody

Adds physics properties to an entity.

```typescript
const rigidbody = new Rigidbody({
    mass: 1, // mass in kg
    restitution: 0.8, // bounciness (0-1)
    friction: 0.1, // friction coefficient
});
```

#### Colliders

Define collision shapes for entities.

```typescript
const collider = new CircleCollider(25); // radius
```

### Math Utilities

#### Vector2

2D vector operations for position, velocity, forces, etc.

```typescript
import { Vector2 } from '2d-physics-engine';

const v1 = new Vector2(10, 20);
const v2 = new Vector2(5, 5);

// Operations (all return new vectors, immutable)
const sum = v1.add(v2);
const diff = v1.subtract(v2);
const scaled = v1.scale(2);
const normalized = v1.getNormal();
const magnitude = v1.getMagnitude();
```

#### AABB

Axis-Aligned Bounding Box for spatial queries.

```typescript
import { AABB, Vector2 } from '2d-physics-engine';

const box = new AABB(
    new Vector2(0, 0), // min corner
    new Vector2(100, 100), // max corner
);

// Or use factory methods
const box2 = AABB.fromCenter(new Vector2(50, 50), new Vector2(25, 25));
```

## API Reference

### Core Classes

-   `Entity` - Container for components
-   `Scene` - Manages collections of entities
-   `Iterator` - Main game loop and system manager
-   `InputManager` - Handles keyboard and mouse input

### Components

-   `Transform` - Position, rotation, scale
-   `Rigidbody` - Physics properties
-   `Collider` (abstract) - Collision shape base class
-   `CircleCollider` - Circular collision shape
-   `Controller` - WASD/Arrow key movement controller
-   `Drawer` (abstract) - Rendering base class
-   `CircleDrawer` - Renders circles

### Systems

-   `Physics` - Handles physics simulation
-   `Rendering` - Renders entities with drawer components
-   `CollisionDetector` - Detects collisions between entities
-   `CollisionResolver` - Resolves collisions

### Math

-   `Vector2` - 2D vector class
-   `AABB` - Axis-Aligned Bounding Box
-   `QuadTree` - Spatial partitioning structure

## Examples

### Adding Forces

```typescript
const rigidbody = entity.getComponent(Rigidbody);
if (rigidbody) {
    rigidbody.addForce(new Vector2(100, 0)); // Apply force to the right
}
```

### Custom Drawer

```typescript
import { Drawer, Transform } from '2d-physics-engine';

class MyDrawer extends Drawer {
    draw(ctx: CanvasRenderingContext2D, transform: Transform): void {
        // Your custom rendering code
    }
}
```

### Custom Collider

```typescript
import { Collider, AABB, Transform } from '2d-physics-engine';

class BoxCollider extends Collider {
    static readonly COLLIDER_ID = Symbol('BoxCollider');
    readonly colliderId = BoxCollider.COLLIDER_ID;

    constructor(
        private width: number,
        private height: number,
    ) {
        super();
    }

    getAABB(transform: Transform): AABB {
        // Return AABB based on transform
    }

    calculateInertia(mass: number): number {
        // Calculate moment of inertia
    }
}
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build library
npm run build:lib

# Run tests
npm test

# Format code
npm run format
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Resources

-   [Dot Product](https://www.mathsisfun.com/algebra/vectors-dot-product.html)
-   [Cross Product](https://www.mathsisfun.com/algebra/vectors-cross-product.html)
-   [2D Collisions](https://www.vobarian.com/collisions/2dcollisions2.pdf)
-   [Coefficient of Restitution](https://en.wikipedia.org/wiki/Coefficient_of_restitution)
