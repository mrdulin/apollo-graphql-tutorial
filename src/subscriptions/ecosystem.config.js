const interpreter = 'ts-node';
const script = './src/subscriptions/main.ts';
const name = 'graphql-subscription-backend-server-instance';

module.exports = {
  apps: [
    { name: `${name}-1`, interpreter, script, port: 3001 },
    { name: `${name}-2`, interpreter, script, port: 3002 },
    { name: `${name}-3`, interpreter, script, port: 3003 },
    { name: `${name}-4`, interpreter, script, port: 3004 },
  ],
};
