import { ID } from '../../common/types';
import { ITag } from '../tag/tag';

interface IPostInput {
  postTitle: string;
  postContent: string;
  postTags?: ITag[];
  postAuthorId: ID;
}

export { IPostInput };
