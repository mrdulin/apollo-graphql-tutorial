import { mergeSchemas } from 'apollo-server';
import { schema1 } from './schema1';
import { schema2 } from './schema2';
import { applyMiddleware } from 'graphql-middleware';
import { logCountStandalone } from '../middleware';

let schema = mergeSchemas({ schemas: [schema1, schema2] });
schema = applyMiddleware(schema, logCountStandalone);

export { schema };
