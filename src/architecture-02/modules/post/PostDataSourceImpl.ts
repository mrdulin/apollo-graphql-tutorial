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

  public async insert(post: any) {
    const postPO = {
      post_title: post.postTitle,
      post_content: post.postContent,
      post_author_id: post.postAuthorId,
    };
    return this.db('posts')
      .insert(postPO)
      .then(() => {
        return { code: 0, message: 'insert post done' };
      });
  }
}

export { PostDataSourceImpl };
