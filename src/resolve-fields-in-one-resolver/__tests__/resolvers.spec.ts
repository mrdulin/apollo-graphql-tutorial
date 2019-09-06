import { createTestClient } from 'apollo-server-testing';
import { resolvers } from '../resolvers';
import { typeDefs } from '../typeDefs';
import { ApolloServer, gql } from 'apollo-server';

const mockedMemoryDB = {
  posts: {
    find: jest.fn(),
    map: jest.fn(),
  },
  users: {
    find: jest.fn(),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { memoryDB: mockedMemoryDB },
});
const testClient = createTestClient(server);

const Fragment = {
  PostWithAuthor: `
    fragment PostWithAuthor on Post{
      postId
      postTitle
      postCreatedAt
      postAuthor {
        userId
        userNme
        userEmail
      }
    }
  `,
};

const Query = {
  postById: gql`
    query PostByIdWithAuthor($id: ID!) {
      postById(id: $id) {
        ...PostWithAuthor
      }
    }

    query PostByIdWithoutAuthor($id: ID!) {
      postById(id: $id) {
        postId
        postTitle
        postCreatedAt
      }
    }

    ${Fragment.PostWithAuthor}
  `,
  posts: gql`
    query Posts {
      posts {
        ...PostWithAuthor
      }
    }

    ${Fragment.PostWithAuthor}
  `,
};

const mockedPost = {
  postId: '222',
  postTitle: 'apollo graphql',
  postCreateAt: 'Fri, 06 Sep 2019 10:56:44 GMT',
  postAuthorId: '333',
};

const mockedUser = {
  userId: '333',
  userNme: 'mrdulin',
  userEmail: 'mrdulin@example.com',
};

const mockedPosts = [
  {
    ...mockedPost,
    postAuthor: mockedUser,
  },
];

describe('resolve-fields-in-one-resolver', () => {
  describe('resolvers', () => {
    describe('#postById', () => {
      beforeEach(() => {
        mockedMemoryDB.posts.find.mockReset();
        mockedMemoryDB.users.find.mockReset();
      });
      it('should query post by id with author correctly', async () => {
        mockedMemoryDB.posts.find.mockReturnValueOnce(mockedPost);
        mockedMemoryDB.users.find.mockReturnValueOnce(mockedUser);
        const actualValue = await testClient.query({
          query: Query.postById,
          variables: { id: 1 },
          operationName: 'PostByIdWithAuthor',
        });
        expect(actualValue).toMatchSnapshot();
        expect(mockedMemoryDB.posts.find).toBeCalledTimes(1);
        expect(mockedMemoryDB.users.find).toBeCalledTimes(1);
      });

      it('should query post by id without author correctly, but it will perform a user query from db', async () => {
        mockedMemoryDB.posts.find.mockReturnValueOnce(mockedPost);
        mockedMemoryDB.users.find.mockReturnValueOnce(mockedUser);
        const actualValue = await testClient.query({
          query: Query.postById,
          variables: { id: 1 },
          operationName: 'PostByIdWithoutAuthor',
        });
        expect(actualValue).toMatchSnapshot();
        expect(mockedMemoryDB.posts.find).toBeCalledTimes(1);
        expect(mockedMemoryDB.users.find).toBeCalledTimes(1);
      });
    });

    describe('#posts', () => {
      beforeEach(() => {
        mockedMemoryDB.posts.map.mockReset();
      });

      it('should query posts correctly', async () => {
        mockedMemoryDB.posts.map.mockReturnValueOnce(mockedPosts);
        const actualValue = await testClient.query({ query: Query.posts, operationName: 'Posts' });
        expect(actualValue).toMatchSnapshot();
        expect(mockedMemoryDB.posts.map).toBeCalledTimes(1);
      });
    });
  });
});
