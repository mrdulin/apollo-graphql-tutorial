import { ApolloServerPlugin, GraphQLResponse } from 'apollo-server-plugin-base';

// https://stackoverflow.com/questions/63167965/deprecated-a-stackdriverextension-was-defined-within-the-extensions-configur
class StackDriverExtension implements ApolloServerPlugin {
  public requestDidStart() {
    console.log('requestDidStart');
  }

  public willSendResponse(response: { graphqlResponse: GraphQLResponse }) {
    console.log('willSendResponse');
  }
}

export default StackDriverExtension;
