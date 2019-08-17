import { auth } from './decorator';
import { Role } from '../db';

class PostController {
  public static posts(_, { ids }, { db }) {
    return db.posts.filter((post) => ids.includes(post.id.toString()));
  }
  @auth({ roles: [Role.admin] })
  public static createPost(_, { input }, { db }) {
    const post = {
      id: db.posts.length,
      ...input,
    };
    db.posts.push(post);
    return { code: 0, message: 'ok' };
  }

  public static author(post, _, { db }) {
    return db.users.find((user) => user.id === post.authorId);
  }
  private constructor() {}
}

export { PostController };
