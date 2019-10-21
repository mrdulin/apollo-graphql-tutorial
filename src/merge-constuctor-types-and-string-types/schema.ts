import { mergeSchemas } from 'apollo-server';

import { postSchema } from './modules/post/schema';
import { userSchema } from './modules/user/schema';

export const schema = mergeSchemas({ schemas: [postSchema, userSchema] });
