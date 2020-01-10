import { ApolloServer, gql, SchemaDirectiveVisitor } from 'apollo-server';
import { defaultFieldResolver, GraphQLObjectType, GraphQLFieldMap, GraphQLError } from 'graphql';

const typeDefs = gql`
  directive @logger on OBJECT

  input CreateElementInput {
    name: String!
  }

  type Element {
    id: ID
  }

  type ViewerMutation @logger {
    createElement(input: CreateElementInput): Element
  }

  type Query {
    _: String
  }

  type Mutation {
    viewerMutation: ViewerMutation
  }
`;
const resolvers = {
  Mutation: {
    async viewerMutation(obj, args) {
      console.log(`Mutation.viewerMutation: `, obj, args);
      return { id: 2 };
    },
  },
  ViewerMutation: {
    async createElement(parent, args) {
      console.log('ViewerMutation.createElement: ', parent, args);
      return { id: 1 };
    },
  },
};

class LoggerDirective extends SchemaDirectiveVisitor {
  public visitObject(type: GraphQLObjectType) {
    const fields = type.getFields();
    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function(...args) {
        const [_, params, context, info] = args;
        console.log('context: ', JSON.stringify(context));
        console.log('\nparams: ', params);
        console.log('\nfieldName: ', info.fieldName);
        console.log('\noperation: ', JSON.stringify(info.operation));

        return resolve.apply(this, args);
      };
    });
  }
}
const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    logger: LoggerDirective,
  },
});

if (require.main === module) {
  server.listen().then(({ url }) => {
    console.log(`Apollo server is listening on ${url}`);
  });
}

export { server };
