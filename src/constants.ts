import { Circle, Wall, Capsule } from './classes';

export type PhysicalObject = Circle | Capsule;

const PHYSICAL_OBJECTS: PhysicalObject[] = [
    new Capsule({
        mass: 1,
        friction: 0.01,
        coordinate: { x: 600 / 2, y: 700 / 2 },
        length: 100,
        radius: 25,
        angle: 0,
        isPlayer: true,
    }),
    new Circle({
        mass: 10,
        friction: 0.015,
        elasticity: 0.5,
        coordinate: { x: 100, y: 200 },
        radius: 25,
        linAccelerationUnit: 0.4,
        color: 'brown',
        isFill: true,
    }),
    new Circle({
        mass: 5,
        friction: 0.015,
        elasticity: 0,
        coordinate: { x: 700, y: 200 },
        radius: 25,
        linAccelerationUnit: 1,
        color: 'brown',
        isFill: true,
    }),
    new Circle({
        mass: 1,
        friction: 0.015,
        elasticity: 0,
        coordinate: { x: 200, y: 500 },
        radius: 25,
        linAccelerationUnit: 1,
        color: 'brown',
        isFill: true,
    }),
    new Circle({
        mass: 1,
        friction: 0.01,
        elasticity: 1,
        coordinate: { x: 700, y: 700 },
        radius: 35,
        linAccelerationUnit: 1,
        color: 'brown',
        isFill: true,
    }),
];

const STATIC_OBJECTS = [
    new Wall({ coordinates: { start: { x: 0, y: 5 }, end: { x: 1200, y: 5 } } }),
    new Wall({ coordinates: { start: { x: 0, y: 895 }, end: { x: 1200, y: 895 } } }),
    new Wall({ coordinates: { start: { x: 5, y: 0 }, end: { x: 5, y: 900 } } }),
    new Wall({ coordinates: { start: { x: 1195, y: 0 }, end: { x: 1195, y: 900 } } }),
    // new Wall({ coordinates: { start: { x: 434, y: 300 }, end: { x: 700, y: 800 } } }),
];

export { PHYSICAL_OBJECTS, STATIC_OBJECTS };
