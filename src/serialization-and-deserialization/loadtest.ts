import loadtest, { LoadTestOptions, LoadTestResult } from 'loadtest';

(async function runBenchmark() {
  const options: LoadTestOptions = {
    url: 'http://localhost:3001/users',
    method: 'GET',
    concurrency: 100,
    maxRequests: 10000,
    contentType: 'application/json',
    agentKeepAlive: true,
    statusCallback(error: Error, result: any, latency: LoadTestResult) {
      console.log('Current latency %j, error %j', latency, error);
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

// {"totalRequests":10000,"totalErrors":0,"totalTimeSeconds":164.580863111,"rps":61,"meanLatencyMs":1640.3,"maxLatencyMs":4546,"minLatencyMs":87,"percentiles":{"50":1600,"90":1872,"95":1983,"99":2589},"errorCodes":{}}
// {"totalRequests":10000,"totalErrors":0,"totalTimeSeconds":147.93509533000002,"rps":68,"meanLatencyMs":1474.6,"maxLatencyMs":2811,"minLatencyMs":224,"percentiles":{"50":1438,"90":1737,"95":1837,"99":2286},"errorCodes":{}}
// {"totalRequests":10000,"totalErrors":0,"totalTimeSeconds":142.847074841,"rps":70,"meanLatencyMs":1425.6,"maxLatencyMs":2820,"minLatencyMs":107,"percentiles":{"50":1405,"90":1636,"95":1733,"99":2024},"errorCodes":{}}
// {"totalRequests":10000,"totalErrors":0,"totalTimeSeconds":141.42888752,"rps":71,"meanLatencyMs":1410.7,"maxLatencyMs":2790,"minLatencyMs":88,"percentiles":{"50":1386,"90":1619,"95":1716,"99":2270},"errorCodes":{}},
