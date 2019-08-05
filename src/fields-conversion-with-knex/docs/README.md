# 使用Query Builder - Knex.js在数据库表字段和GraphQL Schema定义的字段之间相互转换

### 问题

数据库表字段的命名规范为：<表名单数>_<字段名称>，小写，下划线分割单词，ERD如下：

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/ERD-fields-conversion-with-knex.png)

GraphQL定义的Schema字段的命名规范为：<表名单数><字段名称>，驼峰命名，GraphQL Schema可视化模型如下：

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/graphql-schema-visual_fields-conversion-with-knex.png)

使用Knex.js作为SQL查询构建工具(Query Builder)，如何以最小的代价，最简单的方式实现上述数据库表字段到GraphQL Schema字段的转换？

### 解决方案

Knex.js提供了两个API，分别是`postProcessResponse`和`wrapIdentifier`，准确说是钩子函数(hook)，用过mongoose的同学应该不会陌生，mongoose中的middleware就是hook：

> Middleware (also called pre and post *hooks*) 

简单说就是可以在一个SQL查询执行之前和之后执行预先定义好的hook，我们可以在hook中进行字段的转换，校验等等。

`postProcessResponse`方法会在每次SQL查询执行之后执行，`wrapIdentifier`方法在SQL查询执行之前进行标识符(identifier)的转换。在Knex.js Query Builder中出现的数据库Schema名，表名，列名，别名都属于identifier。例如，下述Query Builder：

`knex('table').withSchema('foo').select('table.field as otherName').where('id', 1)`

`wrapIdentifier`方法将转换以下标识符：`'table'`, `'foo'`, `'table'`, `field`, `'otherName'`和`'id'`

这两个hooks就是用来进行字段转换的地方，此外，还需要一个转换器（converter），用来在下划线命名和驼峰命名之间进行转换，转换器我使用[humps](https://github.com/domchristie/humps)，示意图如下：

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/schematic-diagram-fields-conversion-with-knex.png)

接下来我们开始分析代码，GraphQL Schema定义如下：

```graphql
import { gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    userId: ID!
    userNme: String
    userEmail: String!
    userPosts: [Post]!
    userFriends: [User]!
  }

  type Post {
    postId: ID!
    postTitle: String!
    postContent: String!
    postCreatedAt: String
    postUpdatedAt: String
    postTags: [Tag]!
    postAuthor: User
  }

  input PostInput {
    postTitle: String!
    postContent: String!
    postTags: [TagInput]
    postAuthorId: ID!
  }

  input TagInput {
    tagNme: String!
  }

  type Tag {
    tagId: ID!
    tagNme: String!
  }

  type CommonResponse {
    code: Int!
    message: String!
  }

  type Query {
    user(id: ID!): User
    post(id: ID!): Post
    posts(ids: [ID!]): [Post]!
  }

  type Mutation {
    post(postInput: PostInput!): CommonResponse
  }
`;
```

上述Schema分别定义了User, Post, Tag, CommonResponse类型(Object Type)，PostInput和TagInput输入类型(Input Type)，以及Query，Mutation类型，接着实现各个类型及其字段的resolver：

```typescript
const resolvers: IResolvers = {
  User: {
    userPosts: (user, _, { PostLoader }: IAppContext) => {
      return PostLoader.userPosts.load(user.userId);
    },
    userFriends: (user, _, { UserLoader }: IAppContext) => {
      return UserLoader.userFriends.loadMany(user.userFriendIds);
    },
  },
  Post: {
    postAuthor: (post, _, { PostLoader }: IAppContext) => {
      return PostLoader.postAuthor.load(post.postId);
    },
    postTags: (post, _, { PostLoader }: IAppContext) => {
      return PostLoader.postTags.load(post.postId);
    },
  },
  Query: {
    user: (_, { id }, { knex }) => {
      const sql = `select * from users where user_id = ?;`;
      return knex
        .raw(sql, [id])
        .get('rows')
        .get(0);
    },
    posts: (_, { ids }: { ids?: ID[] }, { knex }: IAppContext) => {
      const query = knex('posts').select();
      if (ids) {
        query.whereIn('post_id', ids);
      }
      return query;
    },
    post: (_, { id }, { knex }: IAppContext) => {
      return knex('posts')
        .where({ post_id: id })
        .first();
    },
  },

  Mutation: {
    post: (_, { postInput }: { postInput: IPostInput }, { knex }: IAppContext) => {
      const commonResponse = { code: 0, message: '' };
      return knex
        .transaction((trx: Transaction) => {
          const post = {
            postTitle: postInput.postTitle,
            postContent: postInput.postContent,
            userId: postInput.postAuthorId,
          };
          knex('posts')
            .transacting(trx)
            .insert(post)
            .returning(['post_id'])
            .then(([postInserted]) => {
              if (postInput.postTags) {
                const tags = postInput.postTags.map((postTag) => {
                  return { tagNme: postTag.tagNme, postId: postInserted.postId };
                });
                return knex('tags')
                  .transacting(trx)
                  .insert(tags);
              }
              return Promise.resolve(postInserted);
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .then(() => {
          commonResponse.message = 'create post success';
          return commonResponse;
        })
        .catch((error) => {
          console.error(error);
          commonResponse.code = 1;
          commonResponse.message = 'create post error';
          return commonResponse;
        });
    },
  },
};
```



### 参考

* https://mongoosejs.com/docs/middleware.html

  