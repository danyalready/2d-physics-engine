import { Ball, Wall, Capsule, Vector } from './classes';

export type PhysicalObject = Ball | Capsule;

const BODIES: Ball[] = [
    new Ball({
        position: new Vector({ x: 200, y: 200 }),
        radius: 20,
        friction: 0.03,
        color: 'yellow',
        isFill: true,
        isPlayer: true,
    }),
];

const STATIC_OBJECTS = [
    new Wall({ coordinates: { start: { x: 0, y: 5 }, end: { x: 1200, y: 5 } } }), // top wall
    new Wall({ coordinates: { start: { x: 0, y: 895 }, end: { x: 1200, y: 895 } } }), // bottom wall
    new Wall({ coordinates: { start: { x: 5, y: 0 }, end: { x: 5, y: 900 } } }), // left wall
    new Wall({ coordinates: { start: { x: 1195, y: 0 }, end: { x: 1195, y: 900 } } }), // right wall
];

export { STATIC_OBJECTS, BODIES };
