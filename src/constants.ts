import { Ball, Wall, Capsule, Vector } from './classes';

export type PhysicalObject = Ball | Capsule;

const PHYSICAL_OBJECTS: PhysicalObject[] = [
    new Capsule({
        length: 100,
        position: new Vector({ x: 200, y: 200 }),
        isPlayer: true,
    }),
    // new Circle({
    //     mass: 10,
    //     friction: 0.015,
    //     elasticity: 0.5,
    //     coordinate: { x: 100, y: 200 },
    //     radius: 25,
    //     linAccelerationUnit: 0.4,
    //     color: 'brown',
    //     isFill: true,
    // }),
];

const STATIC_OBJECTS = [
    new Wall({ coordinates: { start: { x: 0, y: 5 }, end: { x: 1200, y: 5 } } }), // top wall
    new Wall({ coordinates: { start: { x: 0, y: 895 }, end: { x: 1200, y: 895 } } }), // bottom wall
    new Wall({ coordinates: { start: { x: 5, y: 0 }, end: { x: 5, y: 900 } } }), // left wall
    new Wall({ coordinates: { start: { x: 1195, y: 0 }, end: { x: 1195, y: 900 } } }), // right wall
    // new Wall({ coordinates: { start: { x: 434, y: 300 }, end: { x: 700, y: 800 } } }),
];

export { PHYSICAL_OBJECTS, STATIC_OBJECTS };
