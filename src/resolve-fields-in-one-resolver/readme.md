# GraphQL 中 resolver 的两种写法

基础知识略过，直接进入正题，下面要介绍的`resolver`的两种写法直接关系到性能问题。

先来看下示例的`GraphQL` SDL 的 ERD:

![resolver-fields-in-one-resolver-visualizer](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/resolver-fields-in-one-resolver-visualizer.png)

很常见的数据关系模型，User 和 Post 是一对多的关系，数据库表 ERD 如下:

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/resolver-fields-in-one-resolver-ERD.png)

`GraphQL` SDL 如下：

```typescript
  type User {
    userId: ID!
    userNme: String
    userEmail: String
  }

  type Post {
    postId: ID!
    postTitle: String
    postCreatedAt: String
    postAuthor: User
  }

  type Query {
    postById(id: ID!): Post
    posts: [Post]!
  }
```

示例使用`memoryDB`内存数据库模拟 RDBMS:

```typescript
import faker from 'faker';

const userPK1 = '1';
const userPK2 = '2';

const memoryDB = {
  users: [
    { userId: userPK1, userNme: faker.name.findName(), userEmail: faker.internet.email() },
    { userId: userPK2, userNme: faker.name.findName(), userEmail: faker.internet.email() },
  ],
  posts: [
    {
      postId: '1',
      postTitle: faker.lorem.sentence(),
      postCreatedAt: new Date().toUTCString(),
      postAuthorId: userPK1,
    },
    {
      postId: '2',
      postTitle: faker.lorem.sentence(),
      postCreatedAt: new Date().toUTCString(),
      postAuthorId: userPK1,
    },
  ],
};

export { memoryDB };
```

接下来编写`resolver`，有两种写法，我们来对比和分析一下。

### 在一个 resolver 中解析所有 SDL 定义的字段

`resolver`如下：

```typescript
import { IResolvers } from 'graphql-tools';

const resolvers: IResolvers = {
  Query: {
    async postById(_, { id }, { memoryDB }) {
      const postFound = memoryDB.posts.find((post) => post.postId === id);
      if (postFound) {
        const postAuthor = memoryDB.users.find((user) => user.userId === postFound.postAuthorId);
        postFound.postAuthor = postAuthor;
      }
      console.log(`postFound: ${JSON.stringify(postFound)}`);
      return postFound;
    },
    async posts(_, __, { memoryDB }) {
      return memoryDB.posts.map((post) => {
        post.postAuthor = memoryDB.users.find((user) => user.userId === post.postAuthorId);
        return post;
      });
    },
  },
};

export { resolvers };
```

可以看到，`postById`这个`resolver`在数据库中根据`id`去`posts`表中查询`post`，查询出`post`后，还根据`post`实体上的`postAuthorId`这个外键去`users`表中查询相应的`user`。同理，`posts`这个`resolver`查询出所有的`post`实体后，遍历所有`post`实体，根据`postAuthorId`外键去`users`表中查询每个`post`实体对应的`user`。

接下来我们在`GraphQL` Playground 中编写`GraphQL`客户端查询

![postById](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WX20190610-205958.png)

`postById`这个`query`查询了`Post`这个`Object type`上的所有字段，客户端取得正常返回结果。

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WX20190610-210111.png)

删除`postAuthor`这个查询字段，客户端也取得正常返回结果。

从客户端的角度来看，上述两次查询都取得了正常结果，然而，上述这样编写`resolver`，会让服务端多出很多不必要的字段解析，甚至严重影响应用程序性能。我们继续看第二次查询，客户端并没有查询`postAuthor`这个字段，但是`postById`这个`resolver`却依旧去数据库中查询了`user`作为`postAuthor`，这浪费了一次查询，占用了一个连接池资源。可以试想，如果`postAuthor`是通过`Http`请求去某个远程服务器上获取的，这一次`http`请求也是一次无意义的性能损耗。

同理，客户端查询`posts`，但如果不查询`postAuthor`，然而服务端的`resolver`却给每一个`post`去查询相应的`postAuthor`，这就是很多次的无意义的查询。所以下面介绍官方正确的`resolver`写法：

### 正确的 resolver 写法

```typescript
import { IResolvers } from 'graphql-tools';

const resolversBetter: IResolvers = {
  Query: {
    async postById(_, { id }, { memoryDB }) {
      return memoryDB.posts.find((post) => post.postId === id);
    },
    async posts(_, __, { memoryDB }) {
      return memoryDB.posts;
    },
  },
  Post: {
    async postAuthor(source, _, { memoryDB }) {
      console.count('resolve Post.postAuthor');
      return memoryDB.users.find((user) => user.userId === source.postAuthorId);
    },
  },
};

export { resolversBetter };
```

再次执行之前的两次客户端查询`postById`，客户端不查询`postAuthor`，那么`postById`这个`resolver`只进行了一次数据库查询，根据`id`去`posts`表中查询相应的`post`。

客户端查询`postAuthor`，此时，服务端的`Post.postAuthor`这个`resolver`才会执行，从而去`users`表中查询相应的`user`作为`postAuthor`。下图是客户端查询`postAuthor`的返回结果：

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WX20190610-212624.png)

服务端`Post.postAuthor`这个`resolver`执行后打印出的`console.count`日志如下：

```bash
resolve Post.postAuthor: 1
```

这个问题想出来的比较早，有兴趣的可以看看原始提问:

https://stackoverflow.com/questions/52272727/resolve-all-fields-in-one-resolver-v-s-resolve-field-in-each-resolver

使用一年多下来，有时候觉得`GraphQL`并不严谨，很多问题官方没有解释的很清楚，比如 SDL 中定义循环引用的问题，https://stackoverflow.com/questions/53863934/is-graphql-schema-circular-reference-an-anti-pattern。

以及 SDL 如何设计，`Object` `Type`嵌套层级深度，客户端查询字段如何映射到 SQL 查询 column（SQL 语句中查询的 column 和客户端查询的字段一一对应，不多查 column）的问题。此外还需要解决`N+1` query，缓存问题。

`apollographql`的一些`GraphQL`模块实现也还处于起步阶段，`apollographql`的服务端上传模块[apollo-upload-server](https://www.npmjs.com/package/@apollographql/apollo-upload-server)和客户端上传模块[apollo-upload-client](https://www.npmjs.com/package/apollo-upload-client)相比于[multer](https://github.com/expressjs/multer)和[jQuery-File-Upload](https://github.com/blueimp/jQuery-File-Upload)，弱太多了，只能满足最基本的上传需求，所以如果对上传功能要求比较高的话，建议使用现有更成熟的方案。对于`apollographql`升级到 2.0 以后，使用的`dataSource`，目前官方也只给出了`HTTP`通信的`dataSource`实现[apollo-datasource-rest](https://www.apollographql.com/docs/apollo-server/features/data-sources/)，SQL 和 NoSQL 的`dataSource`实现社区里都是一些个人零零散散的实现，对于新手来说，基本等于没有。

### 源码

https://github.com/mrdulin/apollo-graphql-tutorial/tree/master/src/resolve-fields-in-one-resolver
