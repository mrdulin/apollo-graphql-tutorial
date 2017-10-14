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

PID为93174的进程就是计算机系统分配给`GraphQL` web server应用程序的进程。

在上一篇文章开头提到过，[Apollo Server](https://www.apollographql.com/docs/apollo-server/features/subscriptions) 2.x提供的`PubSub`实现是基于Node.js的`EventEmitter`内部模块。因此，只能在单个应用实例（单个进程）中进行事件的发布订阅，或者说消息的发布与订阅。

然而却无法在多应用实例间（多个进程间）进行消息的发布与订阅，因为，**每个进程都有自己的一部分独立的系统资源，彼此是隔离的** 。什么意思？举个例子，由于进程间是系统资源隔离的，这里以内存为例，内存有栈内存和堆内存。我们使用`JavaScript`在应用程序中声明的变量，存在内存中，一个进程是无法获取其他进程内存中的变量的。同理，如果仅仅使用`EventEmitter`模块，A应用实例通过`PubSub`发送的消息，B应用实例是无法订阅到这条消息的。

因此，我们需要一种进程间通信（IPC）方案，来解决进程间（多个应用实例间）通信的问题。先给出本文`GraphQL` Subscription在多应用实例下的示意图：

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/GraphQL-subscription-2.png)

图画的应该比较明白了，可供我们选择的IPC方案有很多，比如RabbitMQ，GCP的Cloud Pub/Sub，kafka等消息队列，PostgreSQL的`NOTIFY`和`LISTEN`命令。都可以实现在一个应用的多个实例，多个应用多个实例间，甚至应用集群和应用集群之间传递消息和数据的功能。

### 解决方案

本文为了示例简单，在本地环境通过`pm2`启动多个`GraphQL` web server的多个实例。并且手动指定客户端连接不同的web server实例，为了测试使用IPC后，`GraphQL` Subscription使用`websocket`进行消息推送的功能。不过在使用正确的方法之前，会先使用上一篇文章基于`EventEmitter`模块实现的`PubSub`方案，来验证下多服务器应用实例下，客户端收不到消息的场景。

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
启动的4个`GraphQL` web server域名是localhost, 分别监听3001, 3002, 3003, 3004端口。这里为了演示，直接通过`ts-node`运行`TypeScript`编写的代码，生产环境请不要这么做。可以看到4个应用实例有各自的`pid`，表示运行在不同的进程中。

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/pm2-multiple-server-instances.png)

然后我们修改Altair GraphQL Client中每一个client（客户端用户）连接`GraphQL` web server的`Subscription` `url`地址端口号，让客户端按照示意图的方式与`GraphQL` web server各个实例连接，比如:

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WX20190528-102342.png)

然后写好客户端`Subscription`:

```graphql
subscription {
	templateAdded {
    id
    name
    shareLocationIds
  }
}
```

点击"Send Request"，成功建立`websocket`连接。如图所示：

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/establish-websocket-connection-success.png)

可以通过`pm2 logs`命令查看各个 `GraphQL` web server instance 的日志：

![establish-websocket-connection](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/establish-websocket-connection.png)

ZOWI 用户(client 1, client 5)与  `GraphQL` web server instance-1 建立 `websocket` 连接，以及通过 `HTTP` 协议发送`GraphQL` `mutation`创建`template`
ZOLO 用户(client 2)与  `GraphQL` web server instance-2 建立 `websocket` 连接
ZEWI 用户(client 3)与  `GraphQL` web server instance-3 建立 `websocket` 连接
ZELO 用户(client 4)与  `GraphQL` web server instance-4 建立 `websocket` 连接

#### 使用基于PostgreSQL的PubSub实现

接下来使用基于PostgreSQL `NOTIFY`/`LISTEN`命令的`PubSub`实现[graphql-postgres-subscriptions](https://github.com/GraphQLCollege/graphql-postgres-subscriptions)，用来在多个`GraphQL` web server实例间进行消息传递（通信）。

本地启动PostgreSQL数据库服务，我这里使用Docker启动，启动后使用`docker ps`查看启动的PostgreSQL数据库服务容器

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WX20190528-104056.png)

使用PostgreSQL实现的`PubSub`替换使用`EventEmitter`实现的`PubSub`，

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/create-pg-pubsub.png)

在`server.ts`的`createServer`方法中，初始化`postgresPubSub`

```typescript
const postgresPubSub = await createPostgresPubSub();
postgresPubSub.subscribe('error', console.error);
```

将`postgresPubSub`注入到`templateConnector`中

```typescript
templateConnector: new TemplateConnector<IMemoryDB>(
  memoryDB,
  // pubsub,
  postgresPubSub,
),
```

注入到`SubscriptionContext`中

```typescript
 const context: ISubscriptionContext = {
   pubsub: postgresPubSub,
   // pubsub,
   subscribeUser: user,
   userConnector,
   locationConnector: new LocationConnector<IMemoryDB>(memoryDB),
 };
```

在`templateIterator`方法中，可以拿到`SubscriptionContext`，从而拿到`postgresPubSub`

```typescript
function templateIterator(__, ___, { pubsub }: ISubscriptionContext) {
  return pubsub.asyncIterator([TriggerNameType.TEMPLATE_ADDED]);
}
```

关键的几处代码修改完毕。

接下来，使用ZOWI用户（client 5）开始发起一个`addTemplate`的`GraphQL` `mutation`。如下图所示：

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/send-addTemplate-mutation.png)

先看下各个`GraphQL` web server实例的日志：

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/template-filter.png)

可以看到红色框标出来的日志，`templateFilter`方法在各个`GraphQL` web server实例上分别执行了一次，我在`templateFilter`方法中加了`console.count('templateFilter')`，用来进行`debug`，如下图：

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/template-filter-function.png)

说一下流程：ZOWI用户发起`addTemplate`的`GraphQL` `mutation`，创建`template`实体成功后，通过`PubSub`发送`TEMPLATE_ADDED`的消息，如下：

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/addTemplate-mutation.png)

`templateConnector.publish`方法的实现为：

```typescript
public publish(payload: any) {
  this.pubsub.publish(TriggerNameType.TEMPLATE_ADDED, payload);
}
```

4个`GraphQL` web server实例都监听该消息，执行`subscribe`方法，如下图:

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/subscribe-reolver-fn.png)

然后在`templateFilter`方法中，通过上下文可以拿到订阅用户的信息，以及发起`addTemplate`这个`GraphQL` `mutation`的用户信息，当然不仅限于这些信息，理论上可以通过上下文获取到任何信息，需要开发者自己去设计。根据这些信息，就可以实现过滤逻辑，什么消息，满足什么条件推送给客户端，不满足的则不推送。本例的过滤逻辑是：

1. 不将新创建的`template`推送给发起`addTemplate` `GraphQL` `mutation`这个用户自己。
2. 新创建的`template`上有`sharelocationIds`字段，推送给用户实体上`locationId`字段的值与`sharelocationIds`有交集；或者通过`findLocationIdsByOrgId` 方法，通过`orgId`找到与之相关联的所有`location`的`locationIds`，与`sharelocationIds`有交集的用户。

基本流程和逻辑就说到这里，再次执行两次`addTemplate`，来看看客户端接收到的`websocket`信息情况。

首先是`ZOWI`用户

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WX20190528-113646.png)

由于是他自己，所以被"过滤"掉，不会收到`websocket`消息。

`ZOLO`用户

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WX20190528-113758.png)

`ZOLO`用户实体上的`locationId`为`location 3`，`[location 3]`与`sharelocationIds`(`[location 3]`)有交集，因此，要将新创建的`template`推送给该用户，可以看到收到的`websocket`消息，包含新创建的`template`。

同理，`ZEWI`用户

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WX20190528-114128.png)

以及`ZELO`用户

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WX20190528-114209.png)

#### 使用基于EventEmitter的PubSub实现

这里简单看下结果就可以，发起`addTemplate` `mutation`后，查看各个web server实例的日志

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WX20190528-115338.png)

只有web server instance 1自己订阅到了`TEMPLATE_ADDED`消息，并执行了`templateFilter`方法。其他web server instances无法订阅到web server instance 1发送的消息，因为他们运行在不同的进程中，无法使用`EventEmitter`进行通信。

`ZOLO`用户没有收到`websocket`推送的消息

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WX20190528-120025.png)

`ZEWI`用户也没有收到消息

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WX20190528-120115.png)

这篇文章针对的是开发阶段，在本地环境启动多个服务器应用实例，进行开发测试。对于线上环境，比如上到云环境，使用Cloud Kubernetes Engine水平扩展到多个Node，多个Pod，多个Container，App Engine，Compute Engine多实例，原理也是一样的。线上环境相对复杂，有很多额外的工作要做，如果有下一篇文章，会介绍如何使用云平台的这些服务，将这个`GraphQL` Subscription应用程序示例运行在这些服务上。

### 源码

https://github.com/mrdulin/apollo-graphql-tutorial/tree/master/src/subscriptions

### 参考

- https://www.postgresql.org/docs/9.6/sql-notify.html
- https://github.com/emilbayes/pg-ipc
- [GraphQL Subscription多用户订阅与通知（一）](https://github.com/mrdulin/blog/issues/74)
- https://github.com/apollographql/graphql-subscriptions
- https://github.com/GraphQLCollege/graphql-postgres-subscriptions

------

<a href="https://info.flagcounter.com/ab0j"><img src="https://s11.flagcounter.com/count2/ab0j/bg_FFFFFF/txt_000000/border_CCCCCC/columns_2/maxflags_12/viewers_0/labels_1/pageviews_1/flags_0/percent_0/" alt="Flag Counter" border="0"></a>