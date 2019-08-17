import Dataloader from 'dataloader';

const db = {
  users: [{ id: 1, name: 'ts', email: 'aaa@gmail.com' }],
};

const User = {
  findByIds: async (ids: string[]) => {
    console.count('User.findByIds');
    return Promise.all(
      ids.map((id) => {
        return db.users.find((user) => user.id.toString() === id.toString());
      }),
    );
  },

  updateById: async (id: string, updater: { name: string; email: string }) => {
    const user = db.users.find((u) => u.id.toString() === id.toString());
    if (!user) {
      throw new Error('no user found');
    }
    user.name = updater.name || user.name;
    user.email = updater.email || user.email;
    return user;
  },
};

const UserLoader = {
  findByIds: new Dataloader<string, any>((keys) => User.findByIds(keys)),
};

const OtherUserLoader = {
  findByIds: new Dataloader<string, any>((keys) => User.findByIds(keys)),
};

describe('UserLoader', () => {
  describe('#findByIds', () => {
    it('should load user correctly', async () => {
      const id = '1';
      const user = await UserLoader.findByIds.load(id);
      expect(user).toEqual({ id: 1, name: 'ts', email: 'aaa@gmail.com' });
    });

    it('should load from cache at a same tick', async () => {
      const id = '1';
      const [user1, user2] = await Promise.all([UserLoader.findByIds.load(id), UserLoader.findByIds.load(id)]);
      expect(user1).toBe(user2);
      [user1, user2].forEach((user) => {
        expect(user).toEqual({ id: 1, name: 'ts', email: 'aaa@gmail.com' });
      });
    });

    // TODO: simulate, each await statement executes in a new tick
    it('should load cache data if not clear cache after a mutate', async () => {
      const id = '1';
      const user = await UserLoader.findByIds.load(id);
      expect(user).toEqual({ id: 1, name: 'ts', email: 'aaa@gmail.com' });
      const updatedUser = await User.updateById(id, { name: 'go', email: 'bbb@qq.com' });
      expect(updatedUser).toEqual({ id: 1, name: 'go', email: 'bbb@qq.com' });
      const user2 = await UserLoader.findByIds.load(id);
      expect(user2).toEqual({ id: 1, name: 'ts', email: 'aaa@gmail.com' });
      expect(user).toBe(user2);
    });
  });
});
