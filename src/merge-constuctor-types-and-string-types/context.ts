import { db } from './db';

export interface IAppContext {
  db: typeof db;
}
