import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import faker from 'faker';
const app = express();

const typeDefs = gql`
  type Query {
    rockets: [Rocket]!
    rocket(id: ID): Rocket!
  }
  type Rocket {
    id: ID!
    name: String!
    mass: RocketMass
  }
  type MassInt {
    int: Int
  }
  type MassFloat {
    float: Float
  }

  union Mass = MassInt | MassFloat

  type RocketMass {
    kg: Mass
    lb: Mass
  }
`;

const resolvers = {
  Query: {
    rocket: (_, { id }) => {
      return {
        id: 1,
        name: faker.lorem.word(),
        mass: {
          kg: { int: 100 },
          lb: { float: 10.1 },
        },
      };
    },
  },
  Mass: {
    __resolveType: (obj) => {
      if (isInt(obj.int)) {
        return 'MassInt';
      }
      if (isFloat(obj.float)) {
        return 'MassFloat';
      }
      return null;
    },
  },
};

function isInt(n) {
  return Number(n) === n && n % 1 === 0;
}

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}
const server = new ApolloServer({ typeDefs, resolvers });
const port = 4000;
server.applyMiddleware({ app, path: '/graphql' });
app.listen(port, () => console.log(`Apollo server started at http://localhost:${port}`));
