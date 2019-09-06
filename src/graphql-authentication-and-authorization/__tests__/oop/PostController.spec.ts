import { PostController } from '../../oop';
import { Role } from '../../db';
import _ from 'lodash';
import { AuthenticationError } from 'apollo-server';

let context = {
  db: {
    posts: [{ id: 1, authorId: 1 }, { id: 2, authorId: 1 }],
    users: [{ id: 1 }],
  },
  req: {
    user: { role: Role.admin },
  },
};

describe('PostController', () => {
  describe('##posts', () => {
    it('should get posts correctly', () => {
      const actualValue = PostController.posts({}, { ids: ['1'] }, context);
      expect(actualValue).toEqual([{ id: 1, authorId: 1 }]);
    });
  });

  describe('##createPost', () => {
    const backupContext = _.cloneDeep(context);
    beforeEach(() => {
      context = _.cloneDeep(backupContext);
    });
    const input = { title: 'haha', content: 'haha content', authorId: 1 };

    it('should create post correctly when user is admin', () => {
      const actualValue = PostController.createPost({}, { input }, context);
      expect(actualValue).toEqual({ code: 0, message: 'ok' });
      expect(context.db.posts).toHaveLength(3);
    });

    it.each`
      role           | name
      ${Role.viewer} | ${'should throw authentication error when user with viewer role create post'}
      ${Role.editor} | ${'should throw authentication error when user with editor role create post'}
    `(`$name`, ({ role }) => {
      context.req.user.role = role;
      expect(() => PostController.createPost({}, { input }, context)).toThrowError(
        new AuthenticationError('no permission'),
      );
      expect(context.db.posts).toHaveLength(2);
    });

    it('should get author correctly', () => {
      const actualValue = PostController.author(context.db.posts[0], {}, context);
      expect(actualValue).toEqual(context.db.users[0]);
    });
  });
});
