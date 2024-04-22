import { Capsule, Body, Ball } from './bodies';
import { Wall, Vector, Circle } from './classes';

export interface BodyLike extends Body {
    components: Array<Circle>;

    // getClosestPointTo: (vector: Vector) => Vector;
    draw: (ctx: CanvasRenderingContext2D) => void;
}

const BODIES: BodyLike[] = [
    new Ball({
        position: new Vector({ x: 400, y: 200 }),
        radius: 20,
        friction: 0.03,
        elasticity: 0,
        color: 'red',
        isFill: true,
    }),
    new Ball({
        position: new Vector({ x: 200, y: 200 }),
        radius: 20,
        friction: 0.03,
        elasticity: 0,
        linAccelerationUnit: 0.3,
        color: 'red',
        isFill: true,
        isPlayer: true,
    }),
    new Capsule({
        position: new Vector({ x: 400, y: 350 }),
        length: 100,
        radius: 25,
        friction: 0.03,
        color: 'brown',
        mass: 100,
        elasticity: 0,
    }),
    // new Capsule({
    //     position: new Vector({ x: 250, y: 250 }),
    //     length: 150,
    //     radius: 35,
    //     friction: 0.03,
    //     color: 'brown',
    //     elasticity: 0,
    //     angAccelerationUnit: 0.05,
    //     linAccelerationUnit: 0.5,
    //     mass: 10,
    //     isPlayer: true,
    // }),
];

const STATIC_OBJECTS = [
    new Wall({ coordinates: { start: { x: 0, y: 5 }, end: { x: 1200, y: 5 } } }), // top wall
    new Wall({ coordinates: { start: { x: 0, y: 895 }, end: { x: 1200, y: 895 } } }), // bottom wall
    new Wall({ coordinates: { start: { x: 5, y: 0 }, end: { x: 5, y: 900 } } }), // left wall
    new Wall({ coordinates: { start: { x: 1195, y: 0 }, end: { x: 1195, y: 900 } } }), // right wall
];

export { STATIC_OBJECTS, BODIES };
