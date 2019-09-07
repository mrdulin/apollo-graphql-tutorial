import { ID } from '../../common/types';
import { ITagEntity } from '../tag/tag';

interface IPostInput {
  postTitle: string;
  postContent: string;
  postTags?: ITagEntity[];
  postAuthorId: ID;
}

export { IPostInput };
