# load testing

`userById`

```bash
☁  apollo-graphql-tutorial [master] ⚡  npx loadtest http://localhost:3000/graphql -t 20 -c 10 -T application/json -P '{"query": "query{userById(id: 1){userId userNme userEmail}}"}' -m POST
[Mon Jul 27 2020 20:04:54 GMT+0800 (China Standard Time)] INFO Requests: 0, requests per second: 0, mean latency: 0 ms
[Mon Jul 27 2020 20:04:59 GMT+0800 (China Standard Time)] INFO Requests: 661, requests per second: 132, mean latency: 74.8 ms
[Mon Jul 27 2020 20:05:04 GMT+0800 (China Standard Time)] INFO Requests: 1296, requests per second: 127, mean latency: 78.8 ms
[Mon Jul 27 2020 20:05:09 GMT+0800 (China Standard Time)] INFO Requests: 2102, requests per second: 161, mean latency: 62.3 ms
[Mon Jul 27 2020 20:05:14 GMT+0800 (China Standard Time)] INFO
[Mon Jul 27 2020 20:05:14 GMT+0800 (China Standard Time)] INFO Target URL:          http://localhost:3000/graphql
[Mon Jul 27 2020 20:05:14 GMT+0800 (China Standard Time)] INFO Max time (s):        20
[Mon Jul 27 2020 20:05:14 GMT+0800 (China Standard Time)] INFO Concurrency level:   10
[Mon Jul 27 2020 20:05:14 GMT+0800 (China Standard Time)] INFO Agent:               none
[Mon Jul 27 2020 20:05:14 GMT+0800 (China Standard Time)] INFO
[Mon Jul 27 2020 20:05:14 GMT+0800 (China Standard Time)] INFO Completed requests:  2779
[Mon Jul 27 2020 20:05:14 GMT+0800 (China Standard Time)] INFO Total errors:        0
[Mon Jul 27 2020 20:05:14 GMT+0800 (China Standard Time)] INFO Total time:          20.006754521999998 s
[Mon Jul 27 2020 20:05:14 GMT+0800 (China Standard Time)] INFO Requests per second: 139
[Mon Jul 27 2020 20:05:14 GMT+0800 (China Standard Time)] INFO Mean latency:        71.7 ms
[Mon Jul 27 2020 20:05:14 GMT+0800 (China Standard Time)] INFO
[Mon Jul 27 2020 20:05:14 GMT+0800 (China Standard Time)] INFO Percentage of the requests served within a certain time
[Mon Jul 27 2020 20:05:14 GMT+0800 (China Standard Time)] INFO   50%      66 ms
[Mon Jul 27 2020 20:05:14 GMT+0800 (China Standard Time)] INFO   90%      92 ms
[Mon Jul 27 2020 20:05:14 GMT+0800 (China Standard Time)] INFO   95%      110 ms
[Mon Jul 27 2020 20:05:14 GMT+0800 (China Standard Time)] INFO   99%      143 ms
[Mon Jul 27 2020 20:05:14 GMT+0800 (China Standard Time)] INFO  100%      218 ms (longest request)
```

with `--rps 1000`

```bash
npx loadtest http://localhost:3000/graphql -t 20 -c 10 -T application/json -P '{"query": "query{userById(id: 1){userId userNme userEmail}}"}' -m POST --rps 1000
[Mon Jul 27 2020 20:09:33 GMT+0800 (China Standard Time)] INFO Requests: 0, requests per second: 0, mean latency: 0 ms
[Mon Jul 27 2020 20:09:38 GMT+0800 (China Standard Time)] INFO Requests: 701, requests per second: 140, mean latency: 1654.1 ms
[Mon Jul 27 2020 20:09:43 GMT+0800 (China Standard Time)] INFO Requests: 1408, requests per second: 141, mean latency: 5890 ms
[Mon Jul 27 2020 20:09:48 GMT+0800 (China Standard Time)] INFO Requests: 2277, requests per second: 174, mean latency: 10099.6 ms
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO Requests: 3096, requests per second: 164, mean latency: 14252.6 ms
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO Target URL:          http://localhost:3000/graphql
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO Max time (s):        20
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO Concurrency level:   10
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO Agent:               none
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO Requests per second: 1000
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO Completed requests:  3096
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO Total errors:        0
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO Total time:          20.001979189999997 s
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO Requests per second: 155
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO Mean latency:        8324.7 ms
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO Percentage of the requests served within a certain time
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO   50%      8706 ms
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO   90%      14704 ms
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO   95%      15514 ms
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO   99%      16212 ms
[Mon Jul 27 2020 20:09:53 GMT+0800 (China Standard Time)] INFO  100%      16371 ms (longest request)
```

with keep-alive

```bash
npx loadtest http://localhost:3000/graphql -t 20 -c 10 -T application/json -P '{"query": "query{userById(id: 1){userId userNme userEmail}}"}' -m POST -k
[Mon Jul 27 2020 20:13:35 GMT+0800 (China Standard Time)] INFO Requests: 0, requests per second: 0, mean latency: 0 ms
[Mon Jul 27 2020 20:13:40 GMT+0800 (China Standard Time)] INFO Requests: 7005, requests per second: 1403, mean latency: 7.1 ms
[Mon Jul 27 2020 20:13:45 GMT+0800 (China Standard Time)] INFO Requests: 16985, requests per second: 1996, mean latency: 5 ms
[Mon Jul 27 2020 20:13:50 GMT+0800 (China Standard Time)] INFO Requests: 28920, requests per second: 2387, mean latency: 4.2 ms
[Mon Jul 27 2020 20:13:55 GMT+0800 (China Standard Time)] INFO
[Mon Jul 27 2020 20:13:55 GMT+0800 (China Standard Time)] INFO Target URL:          http://localhost:3000/graphql
[Mon Jul 27 2020 20:13:55 GMT+0800 (China Standard Time)] INFO Max time (s):        20
[Mon Jul 27 2020 20:13:55 GMT+0800 (China Standard Time)] INFO Concurrency level:   10
[Mon Jul 27 2020 20:13:55 GMT+0800 (China Standard Time)] INFO Agent:               keepalive
[Mon Jul 27 2020 20:13:55 GMT+0800 (China Standard Time)] INFO
[Mon Jul 27 2020 20:13:55 GMT+0800 (China Standard Time)] INFO Completed requests:  40637
[Mon Jul 27 2020 20:13:55 GMT+0800 (China Standard Time)] INFO Total errors:        0
[Mon Jul 27 2020 20:13:55 GMT+0800 (China Standard Time)] INFO Total time:          20.000404817 s
[Mon Jul 27 2020 20:13:55 GMT+0800 (China Standard Time)] INFO Requests per second: 2032
[Mon Jul 27 2020 20:13:55 GMT+0800 (China Standard Time)] INFO Mean latency:        4.9 ms
[Mon Jul 27 2020 20:13:55 GMT+0800 (China Standard Time)] INFO
[Mon Jul 27 2020 20:13:55 GMT+0800 (China Standard Time)] INFO Percentage of the requests served within a certain time
[Mon Jul 27 2020 20:13:55 GMT+0800 (China Standard Time)] INFO   50%      3 ms
[Mon Jul 27 2020 20:13:55 GMT+0800 (China Standard Time)] INFO   90%      7 ms
[Mon Jul 27 2020 20:13:55 GMT+0800 (China Standard Time)] INFO   95%      8 ms
[Mon Jul 27 2020 20:13:55 GMT+0800 (China Standard Time)] INFO   99%      14 ms
[Mon Jul 27 2020 20:13:55 GMT+0800 (China Standard Time)] INFO  100%      94 ms (longest request)
```
