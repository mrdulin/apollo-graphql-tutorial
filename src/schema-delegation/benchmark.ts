import loadtest, { LoadTestOptions, LoadTestResult } from 'loadtest';

(async function runBenchmark() {
  const options: LoadTestOptions = {
    url: 'http://localhost:3001/graphql',
    method: 'POST',
    concurrency: 100,
    maxRequests: 10000,
    body: {
      query: `
        query {
          userById(id: ${JSON.stringify(1)}){
            id
            bookings(limit: ${JSON.stringify(5)}) {
              id
            }
          }
        }
      `,
    },
    contentType: 'application/json',
    agentKeepAlive: true,
    statusCallback(error: Error, result: any, latency: LoadTestResult) {
      console.log('Current latency %j, result %j, error %j', latency, result, error);
      console.log('----');
      console.log('Request elapsed milliseconds: ', result.requestElapsed);
      console.log('Request index: ', result.requestIndex);
      console.log('Request loadtest() instance index: ', result.instanceIndex);
    },
  };
  loadtest.loadTest(options, (error: Error) => {
    if (error) {
      return console.error('Got an error: %s', error);
    }
    console.log('Tests run successfully');
  });
})();

// 01-basic
// {"totalRequests":10000,"totalErrors":0,"totalTimeSeconds":34.423831678,"rps":290,"meanLatencyMs":343.2,"maxLatencyMs":768,"minLatencyMs":175,"percentiles":{"50":312,"90":463,"95":561,"99":696},"errorCodes":{}}
// {"totalRequests":10000,"totalErrors":0,"totalTimeSeconds":40.231166343,"rps":249,"meanLatencyMs":401.2,"maxLatencyMs":1012,"minLatencyMs":200,"percentiles":{"50":366,"90":547,"95":618,"99":810},"errorCodes":{}}
// {"totalRequests":9999,"totalErrors":0,"totalTimeSeconds":44.558287812,"rps":224,"meanLatencyMs":444.4,"maxLatencyMs":1397,"minLatencyMs":139,"percentiles":{"50":425,"90":596,"95":652,"99":1024},"errorCodes":{}}
// {"totalRequests":9999,"totalErrors":0,"totalTimeSeconds":32.738743162,"rps":305,"meanLatencyMs":326.3,"maxLatencyMs":579,"minLatencyMs":209,"percentiles":{"50":319,"90":394,"95":431,"99":483},"errorCodes":{}},
// {"totalRequests":10000,"totalErrors":0,"totalTimeSeconds":33.708155085,"rps":297,"meanLatencyMs":335.6,"maxLatencyMs":594,"minLatencyMs":180,"percentiles":{"50":328,"90":406,"95":435,"99":513},"errorCodes":{}}

// 02-performance-issue
// {"totalRequests":10000,"totalErrors":0,"totalTimeSeconds":71.659589547,"rps":140,"meanLatencyMs":714.7,"maxLatencyMs":1601,"minLatencyMs":285,"percentiles":{"50":679,"90":884,"95":974,"99":1279},"errorCodes":{}}
// {"totalRequests":10000,"totalErrors":0,"totalTimeSeconds":73.102303436,"rps":137,"meanLatencyMs":729.5,"maxLatencyMs":1230,"minLatencyMs":323,"percentiles":{"50":709,"90":878,"95":925,"99":1022},"errorCodes":{}}
// {"totalRequests":10000,"totalErrors":0,"totalTimeSeconds":86.93127949299999,"rps":115,"meanLatencyMs":866.6,"maxLatencyMs":6262,"minLatencyMs":404,"percentiles":{"50":830,"90":1091,"95":1254,"99":1462},"errorCodes":{}}
// {"totalRequests":10000,"totalErrors":0,"totalTimeSeconds":70.33242707999999,"rps":142,"meanLatencyMs":701.4,"maxLatencyMs":1431,"minLatencyMs":363,"percentiles":{"50":693,"90":835,"95":874,"99":1268},"errorCodes":{}}
// {"totalRequests":10000,"totalErrors":0,"totalTimeSeconds":70.848560746,"rps":141,"meanLatencyMs":702.1,"maxLatencyMs":1716,"minLatencyMs":424,"percentiles":{"50":685,"90":832,"95":907,"99":1253},"errorCodes":{}}
