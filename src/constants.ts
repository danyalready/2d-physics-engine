import { Ball, Capsule } from './bodies';
import { Wall, Vector, Circle, Body } from './classes';

export interface BodyLike extends Body {
    components: Circle[];

    draw: (ctx: CanvasRenderingContext2D) => void;
}

const BODIES: BodyLike[] = [
    new Ball({
        position: new Vector({ x: 200, y: 200 }),
        radius: 20,
        friction: 0.03,
        color: 'yellow',
        isFill: true,
    }),
    new Capsule({ position: new Vector({ x: 500, y: 500 }), length: 100, radius: 25, friction: 0.03, isPlayer: true }),
];

const STATIC_OBJECTS = [
    new Wall({ coordinates: { start: { x: 0, y: 5 }, end: { x: 1200, y: 5 } } }), // top wall
    new Wall({ coordinates: { start: { x: 0, y: 895 }, end: { x: 1200, y: 895 } } }), // bottom wall
    new Wall({ coordinates: { start: { x: 5, y: 0 }, end: { x: 5, y: 900 } } }), // left wall
    new Wall({ coordinates: { start: { x: 1195, y: 0 }, end: { x: 1195, y: 900 } } }), // right wall
];

export { STATIC_OBJECTS, BODIES };
