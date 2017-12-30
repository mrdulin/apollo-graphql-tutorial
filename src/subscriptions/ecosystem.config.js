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
