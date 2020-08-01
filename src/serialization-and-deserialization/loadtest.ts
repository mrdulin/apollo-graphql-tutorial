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
