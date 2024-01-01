import Wall from './Wall';
import PhysicalObject from './PhysicalObject';
// import Vector from './Vector';

describe('Wall class:', () => {
  const wall = new Wall({ coordinates: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }});

  describe('values:', () => {
    test('`vector`', () => {
      expect(wall.vector).toMatchObject({ x: 1, y: 1 });
    });
  });

  describe('methods:', () => {
    test('`getClosestPoint` - static method', () => {
      const physicalObject1 = new PhysicalObject({
        coordinate: { x: -1, y: -1 },
        elasticity: 1,
        friction: 0,
        mass: 1
      });
      const physicalObject2 = new PhysicalObject({
        coordinate: { x: 2, y: 2 },
        elasticity: 1,
        friction: 0,
        mass: 1
      });

      const closestPoint1 = Wall.getClosestPoint(wall, physicalObject1);
      const closestPoint2 = Wall.getClosestPoint(wall, physicalObject2);

      expect(closestPoint1).toMatchObject({ x: 0, y: 0 });
      expect(closestPoint2).toMatchObject({ x: 1, y: 1 });
    });

    // test('`resolveCollision` - static method', () => {
    //   const physicalObject = new PhysicalObject({
    //     coordinate: { x: 0, y: 0.5 },
    //     elasticity: 1,
    //     friction: 0,
    //     mass: 1,
    //     velocity: new Vector({ x: 1, y: 0.5 }),
    //   });


    // });
  });
});
