import { BoxCollider } from '../../components/ColliderComponents/BoxCollider.component';
import { Transform } from '../../components/Transform.component';
import { Entity } from '../../core/Entity';
import { AABB } from '../../math/AABB';
import { Vector2 } from '../../math/Vector2';
import { BroadPhase } from './BroadPhase';

const filters = {
    detector: { layer: 1, mask: 1 },
    resolver: { layer: 1, mask: 1 },
};

const makeEntity = (name: string, position: Vector2): Entity => {
    const entity = new Entity(name);

    entity.addComponent(new Transform(position));
    entity.addComponent(new BoxCollider({ width: 10, height: 10 }, filters));

    return entity;
};

describe('BroadPhase', () => {
    test('queries pairs from selected entities without returning static-static pairs', () => {
        const dynamic = makeEntity('dynamic', new Vector2(10, 10));
        const nearbyStatic = makeEntity('nearby-static', new Vector2(12, 10));
        const farStatic = makeEntity('far-static', new Vector2(80, 80));
        const broadPhase = new BroadPhase(new AABB(new Vector2(0, 0), new Vector2(100, 100)), 8);

        broadPhase.add(dynamic);
        broadPhase.add(nearbyStatic);
        broadPhase.add(farStatic);

        const pairs = broadPhase.getPotentialPairs([dynamic]);

        expect(pairs).toEqual([[dynamic, nearbyStatic]]);
    });
});
