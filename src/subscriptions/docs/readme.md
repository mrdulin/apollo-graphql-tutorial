# GraphQL Subscription多用户订阅与通知（一）

### 前言

这不是一篇面向初学者的文章，阅读此文章以及源码需要熟练掌握以下技术栈，编程范式，软件开发架构及工具：

* GraphQL
* Apollo Server (Version 2)
* Node.js, Express.js, npm, npx
* TypeScript, JavaScript
* 基于JWT的身份认证
* WebSocket
* OOP, FP, MVC
* [Altair GraphQL Client](https://altair.sirmuel.design/)

### 问题

对于一个多用户应用，如何使用GraphQL Subscription实现指定用户/客户端接收订阅通知？

为了更直观的说明问题，画图

![image](https://user-images.githubusercontent.com/17866683/56124163-988c8080-5fa8-11e9-8ffa-aee715f87449.png)

现在有5个client instances, 1个server instance, 4个client instances与server建立了`websocket`连接。这5个client instances分别对应5个用户，用户有个`userType`业务字段。

- [ ] 补UML图

需求是`client 5`执行一个`GraphQL` `Mutation`操作，这里是`addTemplate`，当创建`template`成功以后，怎么通过`WebSocket`这个全双工通信协议，推送新创建的`template`给`client 2`和`client 3`，而不推送给`client 1`,`client 4`。

### 解决方案

这篇文章使用`apollo-server`提供的`PubSub`实现，基于`Node.js` `EventEmitter`。

关键代码：

`addTemplate` `mutation`:

```typescript
addTemplate: (
  __,
  { templateInput },
  { templateConnector, userConnector, requestingUser }: IAppContext
): Omit<ICommonResponse, 'payload'> | undefined => {
  if (userConnector.isAuthrized(requestingUser)) {
    const commonResponse: ICommonResponse = templateConnector.add(templateInput);
    if (commonResponse.payload) {
      const payload = {
        data: commonResponse.payload,
        context: {
          requestingUser
        }
      };
      templateConnector.publish(payload);
    }

    return _.omit(commonResponse, 'payload');
  }
}
```

创建`template`成功后，构造`payload`数据，包含新创建的`template`以及发起此`mutation`的用户`requestingUser`，然后通过`publish`方法发送此`payload`。

`templateConnector.publish`方法：

```typescript
public publish(payload: any) {
  this.pubsub.publish(TriggerNameType.TEMPLATE_ADDED, payload);
}
```

接着看下`Subscription` `resolver`的实现：

```typescript
Subscription: {
  templateAdded: {
    resolve: (
      payload: ISubscriptionPayload<ITemplate, Pick<IAppContext, 'requestingUser'>>,
      args: any,
      subscriptionContext: ISubscriptionContext,
      info: any
    ): ITemplate => {
      return payload.data;
    },
    subscribe: withFilter(templateIterator, templateFilter)
  }
}
```

```typescript
function templateIterator() {
  return pubsub.asyncIterator([TriggerNameType.TEMPLATE_ADDED]);
}

async function templateFilter(
  payload?: ISubscriptionPayload<ITemplate, Pick<IAppContext, 'requestingUser'>>,
  args?: any,
  subscriptionContext?: ISubscriptionContext,
  info?: any
): Promise<boolean> {
  const NOTIFY: boolean = true;
  const DONT_NOTIFY: boolean = false;
  if (!payload || !subscriptionContext) {
    return DONT_NOTIFY;
  }

  const { userConnector, locationConnector } = subscriptionContext;
  const { data: template, context } = payload;

  if (!subscriptionContext.subscribeUser || !context.requestingUser) {
    return DONT_NOTIFY;
  }

  let results: IUser[];
  try {
    results = await Promise.all([
      userConnector.findByEmail(subscriptionContext.subscribeUser.email),
      userConnector.findByEmail(context.requestingUser.email)
    ]);
  } catch (error) {
    console.error(error);
    return DONT_NOTIFY;
  }

  const [subscribeUser, requestingUser] = results;

  // user himself/herself
  if (subscribeUser.id === requestingUser.id) {
    return DONT_NOTIFY;
  }

  const notificationIds = template.shareLocationIds;
  let subscribeLocationIds: string[] = [];
  switch (subscribeUser.userType) {
    case UserType.ZOLO:
    case UserType.ZELO:
      if (subscribeUser.locationId) {
        subscribeLocationIds = [subscribeUser.locationId];
      }
      break;
    case UserType.ZEWI:
    case UserType.ZOWI:
      if (subscribeUser.orgId) {
        subscribeLocationIds = locationConnector.findLocationIdsByOrgId(subscribeUser.orgId);
      }
      break;
  }

  const shouldNotify: boolean = intersection(notificationIds, subscribeLocationIds).length > 0;

  return shouldNotify;
}
```

`templateIterator`方法返回`asyncIterator`，`TriggerNameType.TEMPLATE_ADDED`表示`GraphQL` `Subscription`订阅的频道，或者说主题。

`templateFilter`方法是本示例最关键的代码。该方法返回值是`boolean`类型，返回`true`表示推送消息给客户端，返回`false`则不推送给客户端。看到这里，你也许会有疑问，怎么区分客户端呢？

首先，这个方法，通过`payload`（就是上面`templateConnector.publish`方法发送的`payload`）可以拿到执行`addTemplate` `mutation`操作的用户信息（`requestingUser`），也就是`client 5`。

其次，还可以拿到与服务器建立了`WebSocket`连接的用户信息，怎么拿？代码如下：

```typescript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextFunction,
  subscriptions: {
    onConnect: (
      connectionParams: IWebSocketConnectionParams,
      webSocket: WebSocket,
      connectionContext: ConnectionContext
    ) => {
      console.log('websocket connect');
      console.log('connectionParams: ', connectionParams);
      if (connectionParams.token) {
        const token: string = validateToken(connectionParams.token);
        const userConnector = new UserConnector<IMemoryDB>(memoryDB);
        let user: IUser | undefined;
        try {
          const userType: UserType = UserType[token];
          user = userConnector.findUserByUserType(userType);
        } catch (error) {
          throw error;
        }

        const context: ISubscriptionContext = {
          subscribeUser: user,
          userConnector,
          locationConnector: new LocationConnector<IMemoryDB>(memoryDB)
        };

        return context;
      }

      throw new Error('Missing auth token!');
    },
    onDisconnect: (webSocket: WebSocket, connectionContext: ConnectionContext) => {
      console.log('websocket disconnect');
    }
  }
});
```

通过`connectionParams.token`拿到客户端传递过来的`token`，就是`JWT`。`JWT`经过`verify`以后，我们可以拿到包含在`JWT`中的用户基本信息，比如邮箱，然后就可以通过邮箱地址去数据库中查询用户的信息。本示例简化了`JWT`的流程，使用`authorization: Bearer <userType>`的方式模拟用户的`JWT`。

我们使用Altair GraphQL Client工具来模拟这5个客户端，这个工具比`GraphQL`提供的浏览器中运行的`Playground`要强大，简单说下这款工具的特性：

* 支持设置`request header`, 比如设置`authorization: Bearer <JWT>`，方便调试有身份认证的接口。
* 支持`GraphQL` `Subscription`
* Prettify
* 接口调用历史记录
* 将`GraphQL`查询转换为`curl`命令

等等。

对于订阅用户`client 1`, `client 2`, `client 3` `client 4`，说订阅用户可能不太准确，实际上，每个客户端即可以订阅（建立`WebSocket`连接），也可以发起`GraphQL`查询。

给这4个客户端设置`Subscription`的`URL`和`connectionParams`:

![image](https://user-images.githubusercontent.com/17866683/56128928-967bef00-5fb3-11e9-8bbe-ecc0f4ed3062.png)

设置完成以后，写好`Subscription`:

```
subscription {
	templateAdded {
    id
    name
    shareLocationIds
  }
}
```

点击`Send Request`，与服务端`WebSocket`服务建立连接，建立成功如下图：

![image](https://user-images.githubusercontent.com/17866683/56129108-08eccf00-5fb4-11e9-9a1b-0a0b2a76ba5e.png)

`client 1`建立`WebSocket`连接，服务端日志如下：

```bash
websocket connect
connectionParams:  { token: 'Bearer ZOWI' }
Found user:  { id: 'b70b6a00-b424-481b-a54c-523b3a21fe8d',
  name: 'Elwin Schmitt',
  email: 'Tyrique_Lind12@hotmail.com',
  orgId: '1350c033-88e3-4181-968d-14c13633c4d8',
  locationId: null,
  userType: 'ZOWI' }
```

现在在`templateFilter`方法中，通过`payload`和`subscriptionContext`我们分别拿到了`requestingUser`(`client 5`)，和每个订阅用户(`client 1` , `client 2`, `client 3`, `client 4`)。

这个方法会被执行4次，我们在`templateFilter`方法中加入一行代码：

```typescript
 console.count('templateFilter');
```

当`client 5`执行`addTemplate ` `mutation`时，服务端日志如下：

```bash
templateFilter: 1
templateFilter: 2
templateFilter: 3
templateFilter: 4
```

执行时，`subscriptionContext`参数的`subscribeUser`分别是`client 1` , `client 2`, `client 3`, `client 4`。

这就足够我们区分当前上下文中，是哪个客户端了。

在`template`实体上，有个字段叫做`shareLocationIds`, 业务含义是该`template`可以共享给哪些`location`, 这里可以用它来和`client 1` , `client 2`, `client 3`, `client 4`对应的`location`求**交集**，`client 2`对应的`location`是`location 3`，`client 3`对应的`location`是`location 3`和`location 4`。因此当`shareLocationIds`是`[location 3]`时。

1. `shareLocationsIds`∩ `[location 3]` = `true`，应该推送消息给`client 2`

2. `shareLocationsIds`∩ `[location 3, location 4]` = `true`，应该推送消息给`client 3`

最终结果：

![each-clients](https://user-images.githubusercontent.com/17866683/56122684-89580380-5fa5-11e9-9376-1faf194bb05d.png)

可以看到，`ZOLO`和`ZEWI`用户（客户端`client 2`和`client 3`)收到了服务端`WebSocket`服务推送的消息，这里是新创建的`template`。而其他客户端`client 1`, `client 4`和`client 5`则没有收到推送的消息，满足了开始的需求。

### 源码

https://github.com/mrdulin/apollo-graphql-tutorial/tree/master/src/subscriptions

### 参考

- https://www.apollographql.com/docs/graphql-subscriptions/
- https://www.apollographql.com/docs/apollo-server/features/subscriptions



---

<a href="https://info.flagcounter.com/ab0j"><img src="https://s11.flagcounter.com/count2/ab0j/bg_FFFFFF/txt_000000/border_CCCCCC/columns_2/maxflags_12/viewers_0/labels_1/pageviews_1/flags_0/percent_0/" alt="Flag Counter" border="0"></a>