# GraphQL Subscription 多用户订阅与通知（二）

ZOWI 用户(client 1, client 5)与 backend server instance-1 建立 websocket 连接，以及通过 http 协议发送`GraphQL` `mutation`创建`template`
ZOLO 用户(client 2)与 backend server instance-2 建立 websocket 连接
ZEWI 用户(client 3)与 backend server instance-3 建立 websocket 连接
ZELO 用户(client 4)与 backend server instance-4 建立 websocket 连接

可以通过`pm2 logs`命令查看各个 backend server instance 的日志：

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/20190526213020.png)

### references

- https://www.postgresql.org/docs/9.6/sql-notify.html
- https://github.com/emilbayes/pg-ipc
