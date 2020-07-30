import { mergeSchemas } from 'graphql-tools';
import { getUserServiceSchema, getPostServiceSchema, getTagServiceSchema } from './util';

export async function getSchemaPerfIssue() {
  return mergeSchemas({
    schemas: [await getUserServiceSchema(), await getPostServiceSchema(), await getTagServiceSchema()],
  });
}

export async function getSchema() {
  try {
    const schemas = await Promise.all([getUserServiceSchema(), getPostServiceSchema(), getTagServiceSchema()]);
    return mergeSchemas({ schemas });
  } catch (error) {
    console.log(error);
    throw new Error('get schema error');
  }
}
