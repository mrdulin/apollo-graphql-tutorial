import { Role, IDB } from '../db';

const dbMocked: IDB = {
  users: [
    {
      id: 1,
      name: 'mrdulin',
      email: 'mrdulin@example.com',
      role: Role.viewer,
      bitcoinAddress: 'sxsdfr',
    },
    {
      id: 2,
      name: 'elsa',
      email: 'elsa@example.com',
      role: Role.admin,
      bitcoinAddress: 'sxsdfr',
    },
  ],
  posts: [
    {
      id: 1,
      title: 'ts',
      content: 'ts content',
      authorId: 1,
    },
  ],
};

export const context0 = { db: dbMocked, req: {} };
export const context1 = { db: dbMocked, req: { user: { role: Role.viewer } } };
export const context2 = { db: dbMocked, req: { user: { role: Role.editor } } };
export const context3 = { db: dbMocked, req: { user: { role: Role.admin } } };
