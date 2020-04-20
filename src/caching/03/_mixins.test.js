import { db } from './_mixins';
import faker from 'faker';

describe('caching - _mixins', () => {
  beforeEach(() => {
    db.defaults({
      users: [
        { id: 1, name: faker.name.findName(), email: faker.internet.email() },
        { id: 2, name: faker.name.findName(), email: faker.internet.email() },
        { id: 3, name: faker.name.findName(), email: faker.internet.email() },
      ],
      store: {
        1: 'aaa',
        2: { name: faker.name.findName() },
        3: [],
      },
    }).write();
  });

  describe('#getByIds', () => {
    it('should pass', () => {
      const actual = db
        .get('users')
        .getByIds('id', [1, 2])
        .value();
      expect(actual).toHaveLength(2);
      expect(actual).toEqual(
        expect.arrayContaining([{ id: expect.any(Number), name: expect.any(String), email: expect.any(String) }]),
      );
    });
  });

  describe('#mget', () => {
    it('should pass', () => {
      const actual = db
        .get('store')
        .mget([1, 2, 3])
        .value();
      expect(actual).toEqual(['aaa', { name: expect.any(String) }, []]);
    });
  });
});
