import { IPostDataSource } from './PostDataSource';
import { PostgresSQLDataCource } from '../../datasources';

class PostDataSourceImpl extends PostgresSQLDataCource implements IPostDataSource {
  constructor() {
    super();
  }
  public async findById(id: string): Promise<any> {
    const sql = `
      SELECT * FROM posts WHERE post_id = ?
    `;
    return this.db
      .raw(sql, [id])
      .get('rows')
      .get(0);
  }

  public async find() {
    const sql = `
      SELECT * FROM posts;
    `;
    return this.db.raw(sql).get('rows');
  }
}

export { PostDataSourceImpl };
