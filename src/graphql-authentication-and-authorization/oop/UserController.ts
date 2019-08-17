import { Role } from '../db';
import { auth } from './decorator';
import { defaultFieldResolver } from 'graphql';

class UserController {
  @auth({ roles: [Role.admin, Role.editor, Role.viewer] })
  public static user(_, { id }, { db }) {
    return db.users.find((user) => user.id.toString() === id);
  }
  @auth({ roles: [Role.admin] })
  public static adminUsers(_, __, { db }) {
    return db.users.find((user) => user.role === Role.admin);
  }
  @auth({ roles: [Role.admin] })
  public static createUser(_, { input }, { db }) {
    const user = {
      id: db.users.length,
      ...input,
    };
    db.users.push(user);
    return { code: 0, message: 'ok' };
  }
  @auth({ roles: [Role.admin] })
  public static bitcoinAddress(_, __, ___) {
    return defaultFieldResolver;
  }

  private constructor() {}
}

export { UserController };
