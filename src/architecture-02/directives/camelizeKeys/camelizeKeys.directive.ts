import { SchemaDirectiveVisitor } from 'graphql-tools';
import { GraphQLObjectType } from 'graphql';

class CamelizeKeysDirective extends SchemaDirectiveVisitor {
  public visitObject(object: GraphQLObjectType) {
    const fields = object.getFields();
    console.log('directive works');
  }
}

export { CamelizeKeysDirective };
