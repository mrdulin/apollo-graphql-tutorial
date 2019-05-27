# GraphQL Subscription 多用户订阅与通知（二）

### 问题

在上一篇文章中，讲解了如何使用`GraphQL` `Subscription`实现多用户订阅与通知，但是有个问题，我们是在单个服务器应用实例(instance)的基础上实现的，什么意思？来讲下，我们启动一个Node.js服务器应用，比如常见的使用`Express.js`, `Koa.js`创建的Web Server应用，计算机系统都会分配资源（CPU，内存等）给一个进程，然后我们的Web Server应用就运行在这个进程中。在上一篇文章中，是通过如下命令启动了一个实例的`GraphQL` web server:

```typescript
☁  apollo-graphql-tutorial [master] ⚡  npx ts-node src/subscriptions/main.ts
🚀 Server ready at http://localhost:3000/
🚀 Subscriptions ready at ws://localhost:3000/graphql
```

然后使用`ps`命令查看这个`GraphQL` web server的进程：

```bash
☁  apollo-graphql-tutorial [master] ⚡  ps aux | grep ts-node
ldu020           93228   0.0  0.0  4267752    632 s013  R+    8:03PM   0:00.00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn ts-node
ldu020           93174   0.0  0.9  4703956 146972 s011  S+    8:02PM   0:07.11 node /usr/local/bin/npx ts-node src/subscriptions/main.ts
```

在上一篇文章开头提到过，[Apollo Server](https://www.apollographql.com/docs/apollo-server/features/subscriptions) 2.x提供的`PubSub`实现是基于Node.js的`EventEmitter`内部模块。因此，只能在单个应用实例（单个进程）中进行事件的发布订阅，或者说消息的发布与订阅。

然而却无法在多应用实例间（多个进程间）进行消息的发布与订阅，因为，**每个进程都有自己的一部分独立的系统资源，彼此是隔离的。**什么意思？举个例子，由于进程间是系统资源隔离的，这里以内存为例，内存有栈内存和堆内存。我们使用`JavaScript`在应用程序中声明的变量，存在内存中，一个进程是无法获取其他进程内存中的变量的。同理，如果仅仅使用`EventEmitter`模块，A应用实例`PubSub`发送的消息，B应用实例是无法订阅到这条消息的。

因此，我们需要一种进程间通信（IPC）方案，来解决进程间（多个应用实例间）通信的问题。先给出本文`GraphQL` Subscription在多应用实例下的示意图：

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/GraphQL-subscription-2.png)

图画的应该比较明白了，可供我们选择的IPC方案有很多，比如RabbitMQ，GCP的Cloud Pub/Sub，kafka等消息队列，PostgreSQL的`NOTIFY`和`LISTEN`命令。都可以实现在一个应用的多个实例，多个应用多个实例间，甚至应用集群和应用集群之间传递消息和数据的功能。

本文为了示例简单，在本地环境通过`pm2`启动多个`GraphQL` web server的多个实例。并且手动指定客户端连接不同的web server实例，为了测试使用IPC后，`GraphQL` Subscription使用`websocket`进行消息推送的功能。不过在使用正确的方法之前，会先使用之前基于`EventEmitter`模块实现的`PubSub`方案，来验证下多服务器应用实例下，客户端收不到消息的场景。

使用`pm2`配合`ecosystem`文件启动4个`GraphQL` web server instances，`ecosystem.config.js`文件配置如下:

```js
module.exports = {
  apps: [
    {
      name: 'graphql-subscription-backend-server-instance-1',
      interpreter: 'ts-node',
      script: './src/subscriptions/main.ts',
      port: 3001,
    },
    {
      name: 'graphql-subscription-backend-server-instance-2',
      interpreter: 'ts-node',
      script: './src/subscriptions/main.ts',
      port: 3002,
    },
    {
      name: 'graphql-subscription-backend-server-instance-3',
      interpreter: 'ts-node',
      script: './src/subscriptions/main.ts',
      port: 3003,
    },
    {
      name: 'graphql-subscription-backend-server-instance-4',
      interpreter: 'ts-node',
      script: './src/subscriptions/main.ts',
      port: 3004,
    },
  ],
};
```

这里为了演示，直接通过`ts-node`运行`TypeScript`编写的代码，生产环境请不要这么做。

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/pm2-multiple-server-instances.png)

可以通过`pm2 logs`命令查看各个 `GraphQL` web server instance 的日志：

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/20190526213020.png)

ZOWI 用户(client 1, client 5)与  `GraphQL` web server instance-1 建立 websocket 连接，以及通过 `HTTP` 协议发送`GraphQL` `mutation`创建`template`
ZOLO 用户(client 2)与  `GraphQL` web server instance-2 建立 websocket 连接
ZEWI 用户(client 3)与  `GraphQL` web server instance-3 建立 websocket 连接
ZELO 用户(client 4)与  `GraphQL` web server instance-4 建立 websocket 连接

未完待续…TODO...

### 参考

- https://www.postgresql.org/docs/9.6/sql-notify.html
- https://github.com/emilbayes/pg-ipc
- [进程间通信，又叫I]([https://zh.wikipedia.org/wiki/%E8%A1%8C%E7%A8%8B%E9%96%93%E9%80%9A%E8%A8%8A](https://zh.wikipedia.org/wiki/行程間通訊))

